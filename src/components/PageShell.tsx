import { ReactNode } from "react";
import BottomNavigation from "./BottomNavigation";

type PageShellProps = {
  children: ReactNode;
  bottomNav?: boolean;
  className?: string;
};

export default function PageShell({ children, bottomNav = true, className = "" }: PageShellProps) {
  return (
    <div className={`phone-shell bg-surface text-on-surface ${className}`}>
      {children}
      {bottomNav ? <BottomNavigation /> : null}
    </div>
  );
}
