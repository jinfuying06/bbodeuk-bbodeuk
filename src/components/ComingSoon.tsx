import { ReactNode } from "react";

/**
 * 연동 키가 아직 없는 기능(결제, AI 인식)을 덮는 "준비 중" 가림막.
 * ready면 children을 그대로 그리고, 아니면 children을 inert로 막은 뒤 불투명 오버레이를 얹는다.
 */
export default function ComingSoon({
  ready,
  children,
  className = "rounded-3xl",
  label = "준비 중인 기능",
}: {
  ready: boolean;
  children: ReactNode;
  className?: string;
  /** 스크린 리더가 읽는 가림막 이름(가려진 children은 접근성 트리에서 빠진다). */
  label?: string;
}) {
  if (ready) return <>{children}</>;
  return (
    <div className="relative">
      <div aria-hidden="true" inert>
        {children}
      </div>
      <div role="note" aria-label={`${label} — 준비 중이에요, 곧 만나요`} className={`absolute inset-0 flex flex-col items-center justify-center gap-0.5 bg-sky-tint ${className}`}>
        <p aria-hidden="true" className="text-bb-title text-sky-deep">준비 중이에요</p>
        <p aria-hidden="true" className="text-bb-caption text-sky-muted">곧 만나요</p>
      </div>
    </div>
  );
}
