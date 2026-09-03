import { ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import Icon from "./Icon";

type AppHeaderProps = {
  title?: string;
  home?: boolean;
  right?: ReactNode;
};

export default function AppHeader({ title, home = false, right }: AppHeaderProps) {
  const navigate = useNavigate();

  if (home) {
    return (
      <header className="fixed left-1/2 top-0 z-50 w-full max-w-[430px] -translate-x-1/2 bg-surface/80 pt-safe shadow-[0_1px_8px_rgba(0,0,0,0.04)] backdrop-blur-xl">
        <div className="flex h-16 items-center justify-between px-margin-screen">
          <div className="flex items-center gap-space-xs">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-container text-on-primary shadow-sm">
              <Icon name="cleaning_services" className="text-[18px]" fill />
            </div>
            <span className="text-headline-md">뽀득뽀득</span>
          </div>
          <div className="flex items-center gap-space-xxs">
            <button aria-label="알림" className="flex h-11 w-11 items-center justify-center text-on-surface-variant transition-colors active:text-primary">
              <Icon name="notifications" className="text-[24px]" />
            </button>
            <button aria-label="설정" className="flex h-11 w-11 items-center justify-center text-on-surface-variant transition-colors active:text-primary">
              <Icon name="settings" className="text-[24px]" />
            </button>
          </div>
        </div>
      </header>
    );
  }

  return (
    <header className="fixed left-1/2 top-0 z-50 w-full max-w-[430px] -translate-x-1/2 bg-surface/80 pt-safe backdrop-blur-xl">
      <div className="flex h-14 items-center justify-between px-margin-screen">
        <button
          aria-label="뒤로 가기"
          className="-ml-2 flex min-h-[44px] min-w-[44px] items-center justify-center rounded-full text-on-surface-variant transition-all active:scale-95 active:bg-surface-container"
          type="button"
          onClick={() => navigate(-1)}
        >
          <Icon name="arrow_back" className="text-[24px]" />
        </button>
        <h1 className="mx-2 flex-1 truncate text-center text-title-md font-semibold text-on-surface">{title}</h1>
        {right ?? <div className="min-h-[44px] min-w-[44px]" />}
      </div>
    </header>
  );
}
