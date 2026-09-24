import { Link, useLocation } from "react-router-dom";
import Icon from "./Icon";

const tabs = [
  { label: "홈", icon: "nav-home", to: "/home" },
  { label: "공간", icon: "nav-spaces", to: "/spaces" },
  { label: "기록", icon: "nav-record", to: "/quick-record", center: true },
  { label: "히스토리", icon: "nav-history", to: "/history" },
  { label: "청소가이드", icon: "nav-guide", to: "/care" },
];

export default function BottomNavigation() {
  const { pathname } = useLocation();

  return (
    <nav className="fixed bottom-0 left-1/2 z-50 w-full max-w-[430px] -translate-x-1/2 bg-surface/90 pb-safe shadow-[0_-2px_12px_rgba(0,0,0,0.04)] backdrop-blur-xl">
      <div className="flex h-16 items-center justify-around px-space-xs">
        {tabs.map((tab) => {
          const active = tab.to === pathname || (pathname === "/deep-clean" && tab.label === "청소가이드");

          if (tab.center) {
            return (
              <Link key={tab.label} aria-current={active ? "page" : undefined} className="flex flex-1 -mt-4 min-h-[44px] flex-col items-center justify-center" to={tab.to}>
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-sky-brand text-onbrand shadow-[0_4px_12px_rgba(86,217,210,0.4)] transition-transform duration-[120ms] active:scale-95">
                  <Icon name={tab.icon} className="text-[24px]" />
                </div>
                <span className="mt-1 text-label-sm text-sky-deep">{tab.label}</span>
              </Link>
            );
          }

          return (
            <Link
              key={tab.label}
              aria-current={active ? "page" : undefined}
              className={`relative flex min-h-[44px] flex-1 flex-col items-center justify-center gap-0.5 transition-colors ${
                active ? "font-semibold text-sky-deep" : "text-sky-muted"
              }`}
              to={tab.to}
            >
              <span
                aria-hidden="true"
                className={`absolute top-0 h-[3px] w-6 rounded-full bg-sky-deep transition-opacity duration-150 ${
                  active ? "opacity-100" : "opacity-0"
                }`}
              />
              <Icon name={tab.icon} className="text-[22px]" />
              <span className="whitespace-nowrap text-[11px] leading-4">{tab.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
