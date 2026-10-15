import { useEffect, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import AppHeader from "../components/AppHeader";
import ComingSoon from "../components/ComingSoon";
import Icon from "../components/Icon";
import GlassButton from "../components/GlassButton";
import PageIntro from "../components/PageIntro";
import PageShell from "../components/PageShell";
import SpaceExpansionDialog from "../components/SpaceExpansionDialog";
import SwitchRow from "../components/Switch";
import Toast, { useToast } from "../components/Toast";
import { SPACES } from "../data/cleaning";
import { isOrderRecorded, isSpacePurchased, recordSpacePurchase } from "../data/purchases";
import { SPACE_PRICE_KRW } from "../features/payments/prices";
import {
  clearPendingPayment,
  confirmPayment,
  PaymentConfirmError,
  PAYMENTS_READY,
  paymentFailMessage,
  readPendingPayment,
  requestSpacePayment,
  savePendingPayment,
  type PendingPayment,
} from "../features/payments/toss";
import { DEFAULT_SPACES, EXPANSION_CATALOG, hasCompletedSetup, readSetup, writeSetup, type SetupData } from "../data/setup";

// Figma 17 row order: 욕실, 주방, 거실, 방.
const ROWS = ["욕실", "주방", "거실", "침실 / 방"].map((key) => DEFAULT_SPACES.find((space) => space.key === key)!);

function withRequiredSpaces(setup: SetupData): SetupData {
  const requiredKeys = DEFAULT_SPACES.filter((space) => space.required).map((space) => space.key);
  const missing = requiredKeys.filter((key) => !setup.spaces.includes(key));
  if (missing.length === 0) return setup;
  const normalized = { ...setup, spaces: [...setup.spaces, ...missing] };
  writeSetup(normalized);
  return normalized;
}

// Only normalize (and persist) an existing setup; before Setup is completed, show the defaults without writing.
function initialSetup(): SetupData {
  return hasCompletedSetup() ? withRequiredSpaces(readSetup()) : { spaces: DEFAULT_SPACES.map((space) => space.key), roomName: "방" };
}

const spaceKeyFor = (expansionKey: string) => SPACES.find((space) => space.setupKeys.includes(expansionKey))?.key ?? "terrace";

export default function SpaceManage() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const [setup, setSetup] = useState<SetupData>(initialSetup);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [paying, setPaying] = useState(false);
  const [toast, showToast] = useToast();
  const confirming = useRef<string | null>(null); // 승인 중인 orderId — StrictMode 이중 실행 방지
  const paymentResult = params.get("payment");

  const save = (next: SetupData) => {
    setSetup(next);
    writeSetup(next);
  };
  const toggle = (key: string) => save({ ...setup, spaces: setup.spaces.includes(key) ? setup.spaces.filter((space) => space !== key) : [...setup.spaces, key] });

  // 이미 결제한 공간은 꺼져 있어도 목록에 남아 다시 결제 없이 켤 수 있다.
  const owned = EXPANSION_CATALOG.filter((item) => setup.spaces.includes(item.key) || isSpacePurchased(item.key));
  const nextExpansion = EXPANSION_CATALOG.find((item) => !owned.includes(item));
  const nextLabel = nextExpansion ? (SPACES.find((space) => space.key === spaceKeyFor(nextExpansion.key))?.label ?? nextExpansion.label) : "";

  // 토스 결제창에서 돌아온 경우(?payment=success|fail&space=…) 또는 승인 응답을 못 받은 대기 결제가 남은 경우:
  // 대기 결제로 저장 → 서버 승인 → 구매 기록 + 공간 추가. 결과를 모르는 실패(네트워크·5xx)는 대기 결제를 남겨 다음 방문에 다시 확인한다.
  useEffect(() => {
    const clearQuery = () => navigate("/space-manage", { replace: true });
    if (paymentResult && paymentResult !== "success") {
      showToast(paymentFailMessage(params.get("code")));
      clearQuery();
      return;
    }
    let pending: PendingPayment | null = null;
    if (paymentResult === "success") {
      const query = { paymentKey: params.get("paymentKey"), orderId: params.get("orderId"), amount: Number(params.get("amount")), space: params.get("space") };
      if (query.paymentKey && query.orderId && query.space && query.amount === SPACE_PRICE_KRW && !isOrderRecorded(query.orderId)) {
        pending = query as PendingPayment;
        savePendingPayment(pending);
      } else {
        clearQuery(); // 잘못된 쿼리이거나 이미 처리한 주문(새로고침)
      }
    }
    pending ??= readPendingPayment();
    if (!pending || confirming.current === pending.orderId) return;
    const { paymentKey, orderId, amount, space } = pending;
    const expansion = EXPANSION_CATALOG.find((item) => item.key === space);
    if (!expansion || isOrderRecorded(orderId)) {
      clearPendingPayment();
      return;
    }
    confirming.current = orderId;
    setPaying(true);
    confirmPayment(paymentKey, orderId, amount)
      .then(() => {
        recordSpacePurchase(expansion.key, orderId);
        const base = initialSetup();
        if (!base.spaces.includes(expansion.key)) writeSetup({ ...base, spaces: [...base.spaces, expansion.key] });
        clearPendingPayment();
        navigate(`/space-added?space=${spaceKeyFor(expansion.key)}`, { replace: true });
      })
      .catch((error: unknown) => {
        confirming.current = null;
        setPaying(false);
        if (error instanceof PaymentConfirmError && error.retryable) {
          // 쿼리도 남겨 둔다 — localStorage에 저장하지 못했어도 새로고침으로 다시 확인할 수 있게.
          showToast("결제를 확인하고 있어요. 잠시 후 다시 열면 자동으로 확인해요.");
          return;
        }
        clearPendingPayment();
        showToast(paymentFailMessage(null));
        clearQuery();
      });
  }, [paymentResult, params, navigate, showToast]);

  const pay = () => {
    if (!nextExpansion || paying) return;
    setPaying(true);
    requestSpacePayment(nextExpansion.key, nextLabel).catch((error: unknown) => {
      // 결제창에서 사용자가 닫은 경우 등 — 리다이렉트되지 않고 여기로 온다.
      setPaying(false);
      setDialogOpen(false);
      showToast(error instanceof Error ? error.message : "결제를 시작하지 못했어요");
    });
  };

  const rows = [
    ...ROWS.map((space) => ({ key: space.key, label: space.key === "침실 / 방" ? setup.roomName : space.label, locked: space.required })),
    ...owned.map((space) => ({ key: space.key, label: space.label, locked: false })),
  ];

  return (
    <PageShell>
      <AppHeader title="공간 관리" back="/spaces" />
      <main className="flex flex-1 flex-col gap-3 px-margin-screen pb-nav pt-header">
        <PageIntro title="내 집에 맞게 관리해요" body="필요한 공간만 켜두세요." className="pb-6" />

        {rows.map((row) => (
          <SwitchRow key={row.key} label={row.label} locked={row.locked} on={row.locked || setup.spaces.includes(row.key)} onToggle={() => toggle(row.key)} />
        ))}

        <p className="text-bb-caption text-sky-muted">* 욕실과 주방은 기본 관리 공간이에요.</p>

        <section className="flex flex-col gap-2 rounded-3xl bg-sky-tint px-5 pb-4 pt-4">
          <h2 className="text-bb-title text-sky-ink">공간을 조금 더 넓혀볼까요?</h2>
          <p className="text-bb-body text-sky-muted">베란다·드레스룸 같은 공간을 더할 수 있어요.</p>
          <p className="text-bb-caption text-sky-muted">공간 1개 {SPACE_PRICE_KRW.toLocaleString()}원 · 한 번 결제로 계속 사용</p>
        </section>

        {nextExpansion ? (
          <ComingSoon className="rounded-full" label="추가 공간 결제" ready={PAYMENTS_READY}>
            <GlassButton variant="secondary" className="w-full" disabled={paying} onClick={() => setDialogOpen(true)}>
              <Icon name="plus" className="text-[16px]" />
              추가 공간 살펴보기
            </GlassButton>
          </ComingSoon>
        ) : null}
      </main>
      {nextExpansion ? (
        <SpaceExpansionDialog
          open={dialogOpen}
          paying={paying}
          previewItems={nextExpansion.previewItems}
          spaceLabel={nextLabel}
          onClose={() => {
            if (!paying) setDialogOpen(false);
          }}
          onConfirm={pay}
        />
      ) : null}
      <Toast message={toast} visible={Boolean(toast)} />
    </PageShell>
  );
}
