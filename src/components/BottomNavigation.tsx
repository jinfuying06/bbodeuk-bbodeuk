import { Link, useLocation } from "react-router-dom";
import Icon from "./Icon";

// `match` = path prefixes that light this tab up (sub-pages map to their parent tab, per Figma page 02).
const tabs = [
  { label: "홈", icon: "nav-home", to: "/home", match: ["/home", "/settings", "/points", "/help"] },
  { label: "공간", icon: "nav-spaces", to: "/spaces", match: ["/spaces", "/space-manage", "/space-info", "/space-added", "/item-add", "/item-info"] },
  { label: "기록", icon: "nav-record", to: "/quick-record", match: ["/quick-record", "/record-done", "/deep-clean", "/weekend-bigclean"] },
  { label: "히스토리", icon: "nav-history", to: "/history", match: ["/history", "/item-history", "/home/error", "/home/loading", "/home/empty"] },
  { label: "가이드", icon: "nav-guide", to: "/care", match: ["/care"] },
];

const isActive = (pathname: string, prefixes: string[]) => prefixes.some((prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`) || pathname.startsWith(`${prefix}-`));

export default function BottomNavigation() {
  const { pathname } = useLocation();
  // Exact match wins over prefix match (e.g. /home/error → 히스토리, Figma 21/22/23).
  const activeTab = tabs.find((tab) => tab.match.includes(pathname)) ?? tabs.find((tab) => isActive(pathname, tab.match));

  return (
    <nav className="fixed bottom-0 left-1/2 z-50 w-full max-w-[430px] -translate-x-1/2 bg-sky-white pb-[max(12px,env(safe-area-inset-bottom))] pt-3">
      <div className="mx-3 flex h-12 items-center justify-between">
        {tabs.map((tab) => {
          const active = tab === activeTab;
          return (
            <Link
              key={tab.label}
              aria-current={active ? "page" : undefined}
              className={`flex h-12 w-16 flex-col items-center justify-center gap-[3px] transition-colors ${active ? "text-sky-deep" : "text-sky-muted"}`}
              to={tab.to}
            >
              <Icon name={tab.icon} className="text-[22px]" />
              <span className="whitespace-nowrap text-bb-small">{tab.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
