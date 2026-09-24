import { ReactNode } from "react";

/** Page intro: h1 heading + muted body, min 88px (Figma intro block). `className` for Figma-specific taller frames. */
export default function PageIntro({ title, body, className = "" }: { title: ReactNode; body?: ReactNode; className?: string }) {
  return (
    <section className={`flex min-h-[88px] shrink-0 flex-col gap-2 ${className}`}>
      <h1 className="text-bb-heading text-sky-ink">{title}</h1>
      {body ? <p className="text-bb-body text-sky-muted">{body}</p> : null}
    </section>
  );
}
