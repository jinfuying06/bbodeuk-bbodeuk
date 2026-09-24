import { useNavigate } from "react-router-dom";
import Dialog from "./Dialog";
import { isMember, readPoints, SIGNUP_BONUS, SPACE_PRICE } from "../data/points";
import { particle } from "../data/josa";

type SpaceExpansionDialogProps = {
  open: boolean;
  onClose: () => void;
  /** Space being added (Figma 32:1012 interpolates it into the title). */
  spaceLabel?: string;
  /** Member with enough points confirmed. Omitted (Setup) → go to 공간 관리 to finish there. */
  onConfirm?: () => void;
};

/** Figma 32:1012 공간 추가 확인 — member / guest / not-enough-points variants of Sky / Dialog. */
export default function SpaceExpansionDialog({ open, onClose, spaceLabel = "새 공간", onConfirm }: SpaceExpansionDialogProps) {
  const navigate = useNavigate();
  if (!open) return null;

  const balance = readPoints();
  const content = !isMember()
    ? {
        title: `회원가입 하면 ${SIGNUP_BONUS}P를 드려요`,
        body: ["가입 시 받는 포인트로 공간 1개를", "바로 추가할 수 있어요."],
        primaryLabel: "회원가입 하러 가기",
        onPrimary: () => navigate("/signup"),
      }
    : balance >= SPACE_PRICE
      ? {
          title: `${spaceLabel}${particle(spaceLabel, "을/를")} 추가할까요?`,
          body: [`${SPACE_PRICE}P를 사용해 새 공간을 열어요.`, `현재 ${balance.toLocaleString()}P → 추가 후 ${(balance - SPACE_PRICE).toLocaleString()}P`],
          primaryLabel: `${SPACE_PRICE}P로 공간 추가`,
          onPrimary: onConfirm ?? (() => navigate("/space-manage")),
        }
      : {
          title: "포인트가 부족해요",
          body: [`공간 1개를 추가하려면 ${SPACE_PRICE}P가 필요해요.`, `지금 보유 포인트는 ${balance.toLocaleString()}P예요.`],
          primaryLabel: "포인트 충전하러 가기",
          onPrimary: () => navigate("/points?intent=short"),
        };

  return (
    <Dialog
      open
      body={
        <>
          {content.body[0]}
          <br />
          {content.body[1]}
        </>
      }
      primaryLabel={content.primaryLabel}
      title={content.title}
      onClose={onClose}
      onPrimary={content.onPrimary}
    />
  );
}
