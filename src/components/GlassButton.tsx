import { ButtonHTMLAttributes, ReactNode, useState } from "react";
import { Link } from "react-router-dom";

type GlassButtonProps = {
  children: ReactNode;
  /** primary = sky-brand / onbrand (default), secondary = sky-tint / sky-deep. Disabled styling comes from `disabled`. */
  variant?: "primary" | "secondary";
  /** Figma heights: 56 for main CTAs (default), 52 for secondary/in-list buttons. */
  size?: 56 | 52;
  /** Renders a router <Link> instead of a <button>. */
  to?: string;
  className?: string;
} & Omit<ButtonHTMLAttributes<HTMLButtonElement>, "className" | "children">;

/** Sky / Glass Button (Figma 25:98): press inset shadow + one specular sweep per tap. */
export default function GlassButton({ children, variant = "primary", size = 56, to, className = "", type = "button", onPointerDown, ...rest }: GlassButtonProps) {
  // Each press mounts a new sweep span (keyed), which restarts the CSS animation.
  const [sweeps, setSweeps] = useState(0);
  const classes = `glass-btn ${size === 56 ? "h-14" : "h-[52px]"} ${variant === "primary" ? "bg-sky-brand text-onbrand" : "bg-sky-tint text-sky-deep"} ${className}`;
  const sweep = sweeps > 0 ? <span key={sweeps} aria-hidden="true" className="glass-sweep" /> : null;

  if (to) {
    return (
      <Link className={classes} to={to} onPointerDown={() => setSweeps((n) => n + 1)}>
        {children}
        {sweep}
      </Link>
    );
  }

  return (
    <button
      className={classes}
      type={type}
      onPointerDown={(event) => {
        if (!rest.disabled) setSweeps((n) => n + 1);
        onPointerDown?.(event);
      }}
      {...rest}
    >
      {children}
      {sweep}
    </button>
  );
}
