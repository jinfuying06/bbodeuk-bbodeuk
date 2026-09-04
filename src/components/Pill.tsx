import { ReactNode } from "react";

type PillProps = {
  children: ReactNode;
  className?: string;
};

export default function Pill({ children, className = "" }: PillProps) {
  return <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-caption font-semibold ${className}`}>{children}</span>;
}
