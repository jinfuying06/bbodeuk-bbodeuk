import { Link, useLocation } from "react-router-dom";
import Icon from "./Icon";

const tabs = [
  { label: "홈", icon: "cottage", to: "/" },
  { label: "공간", icon: "grid_view", to: "/" },
  { label: "기록", icon: "add", to: "/quick-record", center: true },
  { label: "히스토리", icon: "calendar_month", to: "/" },
  { label: "케어", icon: "auto_awesome", to: "/weekend-bigclean" },
];

export default function BottomNavigation() {
  const { pathname } = useLocation();

  return (
    <nav className="fixed bottom-0 left-1/2 z-50 w-full max-w-[430px] -translate-x-1/2 bg-surface/90 pb-safe shadow-[0_-2px_12px_rgba(0,0,0,0.04)] backdrop-blur-xl">
      <div className="flex h-16 items-center justify-around px-space-xs">
        {tabs.map((tab) => {
          const active = tab.to === pathname || (pathname === "/weekend-bigclean" && tab.label === "케어");

          if (tab.center) {
            return (
              <Link key={tab.label} className="flex flex-1 -mt-4 min-h-[44px] flex-col items-center justify-center" to={tab.to}>
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary-container text-on-primary shadow-[0_4px_12px_rgba(0,161,255,0.3)] transition-transform active:scale-95">
                  <Icon name={tab.icon} className="text-[26px]" />
                </div>
                <span className="mt-1 text-label-sm text-primary">{tab.label}</span>
              </Link>
            );
          }

          return (
            <Link
              key={tab.label}
              className={`flex min-h-[44px] flex-1 flex-col items-center justify-center gap-0.5 transition-colors ${
                active ? "font-semibold text-primary" : "text-on-surface-variant"
              }`}
              to={tab.to}
            >
              <Icon name={tab.icon} className="text-[24px]" fill={active} />
              <span className="text-label-sm">{tab.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
