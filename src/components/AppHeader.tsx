import { ReactNode } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Icon from "./Icon";

type AppHeaderProps = {
  title: string;
  /**
   * Sub-page variant (Figma "Brand / header" with ‹ back + centered title).
   * `true` → navigate(-1), falling back to /home when there is no in-app history
   * (direct URL entry). Pass a path string to choose the fallback.
   */
  back?: boolean | string;
  /**
   * Sub-page right slot. Omitted/`null` → empty 44px spacer, keeps the title centered.
   */
  right?: ReactNode | null;
};

const shell = "fixed left-1/2 top-0 z-50 w-full max-w-[430px] -translate-x-1/2 bg-sky-bg pt-safe";

export default function AppHeader({ title, back, right }: AppHeaderProps) {
  const navigate = useNavigate();
  const location = useLocation();

  if (!back) {
    // Tab-root variant: brand-colored title left, 내 정보 (account) right.
    return (
      <header className={shell}>
        <div className="flex h-header items-center justify-between px-6">
          <span className="truncate text-bb-title text-sky-deep">{title}</span>
          <Link aria-label="내 정보" className="flex h-11 w-11 shrink-0 items-center justify-center text-sky-muted transition-colors active:text-sky-deep" to="/settings">
            <Icon name="account" className="text-[22px]" />
          </Link>
        </div>
      </header>
    );
  }

  const goBack = () => {
    // location.key is "default" on the first entry of this tab — nothing in-app to go back to.
    if (location.key === "default") navigate(typeof back === "string" ? back : "/home", { replace: true });
    else navigate(-1);
  };

  return (
    <header className={shell}>
      <div className="flex h-header items-center justify-between px-4">
        <button aria-label="이전 화면으로" className="flex h-11 w-11 shrink-0 items-center justify-center text-sky-deep transition-opacity active:opacity-60" type="button" onClick={goBack}>
          <Icon name="chevron-left" className="text-[22px]" />
        </button>
        <span className="min-w-0 flex-1 truncate text-center text-bb-label text-sky-ink">{title}</span>
        <div className="flex h-11 min-w-11 shrink-0 items-center justify-center">{right}</div>
      </div>
    </header>
  );
}
