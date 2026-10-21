import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AppHeader from "../components/AppHeader";
import Dialog from "../components/Dialog";
import Icon from "../components/Icon";
import PageShell from "../components/PageShell";
import SwitchRow from "../components/Switch";
import { PURCHASES_KEY } from "../data/purchases";
import { getSession, logOut } from "../data/session";
import { PENDING_PAYMENT_KEY } from "../features/payments/toss";

const navRow = "press flex h-[62px] items-center justify-between rounded-row-sm bg-sky-surface px-4";

function NavRow({ to, label, value }: { to: string; label: string; value?: string }) {
  return (
    <Link className={navRow} to={to}>
      <span className="text-bb-label text-sky-ink">{label}</span>
      <span className="flex items-center gap-1.5 text-bb-body text-sky-muted">
        {value}
        <Icon name="chevron-right" className="text-[16px]" />
      </span>
    </Link>
  );
}

function SettingSwitch({ label, defaultOn }: { label: string; defaultOn: boolean }) {
  const [on, setOn] = useState(defaultOn);
  return <SwitchRow label={label} on={on} onToggle={() => setOn(!on)} />;
}

/** Wipes every `bbodeuk.*` key except paid purchases (and a payment still awaiting confirmation), then reloads so in-memory caches (records etc.) start fresh. */
function resetAllData() {
  for (const storage of [window.localStorage, window.sessionStorage]) {
    Object.keys(storage)
      .filter((key) => key.startsWith("bbodeuk.") && key !== PURCHASES_KEY && key !== PENDING_PAYMENT_KEY)
      .forEach((key) => storage.removeItem(key));
  }
  window.location.assign(import.meta.env.BASE_URL);
}

export default function Settings() {
  const [confirmReset, setConfirmReset] = useState(false);
  const navigate = useNavigate();
  const session = getSession();
  const name = session?.mode === "member" && session.nickname ? session.nickname : "게스트";

  return (
    <PageShell>
      <AppHeader title="설정" back />
      <main className="flex flex-col gap-3 px-margin-screen pb-nav pt-header">
        <section className="flex h-[100px] flex-col gap-2 rounded-3xl bg-sky-tint px-5 pt-4">
          <h1 className="text-bb-title text-sky-ink">{name}님의 아늑한 집</h1>
          <p className="text-bb-body text-sky-muted">오늘도 내 속도로 산뜻하게.</p>
        </section>

        <NavRow to="/space-manage" label="공간 관리" />

        <h2 className="text-bb-title text-sky-ink">추천과 알림</h2>
        <SettingSwitch label="기본 추천 사용" defaultOn />
        <SettingSwitch label="부드러운 추천 알림" defaultOn={false} />

        <NavRow to="/help" label="도움말·서비스 정보" />
        <button className={navRow} type="button" onClick={() => setConfirmReset(true)}>
          <span className="text-bb-label text-sky-ink">데이터 초기화</span>
          <Icon name="chevron-right" className="text-[16px] text-sky-muted" />
        </button>
        <button
          className={navRow}
          type="button"
          onClick={() => {
            logOut();
            navigate("/", { replace: true });
          }}
        >
          <span className="text-bb-label text-sky-ink">로그아웃</span>
          <Icon name="chevron-right" className="text-[16px] text-sky-muted" />
        </button>

        <p className="text-bb-caption text-sky-muted">뽀득뽀득 · 버전 0.1.0</p>
        <Link className="-my-3 flex h-11 items-center self-start text-bb-caption text-sky-deep" to="/welcome">
          터치·유리광 효과 체험<Icon name="chevron-right" className="ml-1.5 text-[12px]" />
        </Link>
        <Link className="text-link" to="/help">
          기록·공간 이용 안내<Icon name="chevron-right" className="ml-1.5 text-[14px]" />
        </Link>
      </main>
      <Dialog
        open={confirmReset}
        title="데이터를 초기화할까요?"
        body="이 기기에 저장된 청소 기록과 공간 설정이 모두 지워져요. 구매한 공간은 유지돼요."
        primaryLabel="초기화"
        onPrimary={resetAllData}
        onClose={() => setConfirmReset(false)}
      />
    </PageShell>
  );
}
