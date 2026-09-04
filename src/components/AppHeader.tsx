import { ReactNode } from "react";
import { Link } from "react-router-dom";
import BrandLogo from "./BrandLogo";
import Icon from "./Icon";

type AppHeaderProps = {
  title?: string;
  home?: boolean;
  right?: ReactNode;
};

export default function AppHeader({ title, home = false, right }: AppHeaderProps) {
  const actions = right ?? (
    <div className="flex items-center gap-space-xxs">
      <button aria-label="알림" className="flex h-11 w-11 items-center justify-center text-on-surface-variant transition-colors active:text-primary">
        <Icon name="notifications" className="text-[24px]" />
      </button>
      <Link aria-label="설정" className="flex h-11 w-11 items-center justify-center text-on-surface-variant transition-colors active:text-primary" to="/settings">
        <Icon name="settings" className="text-[24px]" />
      </Link>
    </div>
  );

  if (home) {
    return (
      <header className="fixed left-1/2 top-0 z-50 w-full max-w-[430px] -translate-x-1/2 bg-surface/80 pt-safe shadow-[0_1px_8px_rgba(0,0,0,0.04)] backdrop-blur-xl">
        <div className="flex h-16 items-center justify-between px-margin-screen">
          <div className="flex items-center gap-space-xs">
            <BrandLogo />
            <span className="text-title-md text-on-surface">뽀득뽀득</span>
          </div>
          {actions}
        </div>
      </header>
    );
  }

  return (
    <header className="fixed left-1/2 top-0 z-50 w-full max-w-[430px] -translate-x-1/2 bg-surface/80 pt-safe shadow-[0_1px_8px_rgba(0,0,0,0.04)] backdrop-blur-xl">
      <div className="flex h-16 items-center justify-between gap-space-xs px-margin-screen">
        <Link aria-label="홈으로 이동" className="flex min-h-[44px] min-w-0 flex-1 items-center gap-space-xs transition-opacity active:opacity-70" to="/home">
          <BrandLogo />
          <span className="shrink-0 text-title-md text-on-surface">뽀득뽀득</span>
          {title ? (
            <>
              <Icon name="chevron_right" className="shrink-0 text-[20px] text-outline" />
              <span className="truncate text-title-sm font-semibold text-on-surface">{title}</span>
            </>
          ) : null}
        </Link>
        {actions}
      </div>
    </header>
  );
}
