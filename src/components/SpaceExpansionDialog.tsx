import Dialog from "./Dialog";
import { SPACE_PRICE_KRW } from "../features/payments/prices";
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

/** Figma 32:1012 공간 추가 확인 (Sky / Dialog) — 결제 전 확인: 받는 것, 원화 금액, 환불 안내. */
export default function SpaceExpansionDialog({ open, onClose, spaceLabel, previewItems, paying, onConfirm }: SpaceExpansionDialogProps) {
  const price = SPACE_PRICE_KRW.toLocaleString();
  return (
    <Dialog
      open={open}
      title={`${spaceLabel}${particle(spaceLabel, "을/를")} 추가할까요?`}
      body={
        <>
          {previewItems.join(" · ")} 같은 청소 항목이 함께 생겨요.
          <br />
          {price}원 한 번 결제로 계속 사용해요.
          <span className="mt-2 block text-bb-caption">결제 후 7일 이내, 공간을 사용하지 않았다면 환불할 수 있어요.</span>
        </>
      }
      primaryLabel={paying ? "결제하는 중…" : `${price}원 결제하기`}
      onClose={onClose}
      onPrimary={onConfirm}
    />
  );
}
