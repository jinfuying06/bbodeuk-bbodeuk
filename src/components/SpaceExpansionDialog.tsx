import Dialog from "./Dialog";
import { SPACE_PRICE_FINAL, SPACE_PRICE_KRW } from "../features/payments/prices";
import { particle } from "../data/josa";

type SpaceExpansionDialogProps = {
  open: boolean;
  onClose: () => void;
  /** Space being added (Figma 32:1012 interpolates it into the title). */
  spaceLabel: string;
  previewItems: string[];
  paying: boolean;
  onConfirm: () => void;
};

/** Figma 32:1012 공간 추가 확인 (Sky / Dialog) — 결제 전 확인: 받는 것, 금액(확정 후), 환불 안내. 2026-10-16 문구 축약. */
export default function SpaceExpansionDialog({ open, onClose, spaceLabel, previewItems, paying, onConfirm }: SpaceExpansionDialogProps) {
  const price = SPACE_PRICE_KRW.toLocaleString();
  return (
    <Dialog
      open={open}
      title={`${spaceLabel}${particle(spaceLabel, "을/를")} 추가할까요?`}
      body={
        <>
          {previewItems.join(" · ")} 항목이 생겨요.
          <span className="mt-2 block text-bb-caption">한 번 결제로 계속 써요 · 사용 전 7일 내 환불</span>
        </>
      }
      primaryLabel={paying ? "결제하는 중…" : SPACE_PRICE_FINAL ? `${price}원 결제하기` : "결제하기"}
      onClose={onClose}
      onPrimary={onConfirm}
    />
  );
}
