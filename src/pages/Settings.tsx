import { useState } from "react";
import { Link } from "react-router-dom";
import AppHeader from "../components/AppHeader";
import PageShell from "../components/PageShell";
import { readPoints } from "../data/points";

const navRow = "press flex h-[62px] items-center justify-between rounded-[16px] bg-sky-white px-4";

function NavRow({ to, label, value }: { to: string; label: string; value?: string }) {
  return (
    <Link className={navRow} to={to}>
      <span className="text-bb-label text-sky-ink">{label}</span>
      <span className="whitespace-pre text-bb-body text-sky-muted">
        {value ? `${value}  ` : ""}
        <span aria-hidden="true">›</span>
      </span>
    </Link>
  );
}

/** Sky / Switch (Figma 25:136): 52×32, thumb 24, on = sky-brand, off = sky-line. */
function SwitchRow({ label, defaultOn }: { label: string; defaultOn: boolean }) {
  const [on, setOn] = useState(defaultOn);
  return (
    <button aria-checked={on} className="flex h-[62px] items-center justify-between rounded-[16px] bg-sky-white px-4 text-left" role="switch" type="button" onClick={() => setOn(!on)}>
      <span className="text-bb-label text-sky-ink">{label}</span>
      <span className={`flex h-8 w-[52px] items-center rounded-full px-1 transition-colors duration-200 ${on ? "bg-sky-brand" : "bg-sky-line"}`}>
        <span className={`h-6 w-6 rounded-full bg-sky-white transition-transform duration-200 ${on ? "translate-x-5" : ""}`} />
      </span>
    </button>
  );
}

export default function Settings() {
  const balance = readPoints();

  return (
    <PageShell>
      <AppHeader title="설정" back />
      <main className="flex flex-col gap-3 px-margin-screen pb-nav pt-header">
        <section className="flex h-[100px] flex-col gap-2 rounded-3xl bg-sky-tint px-5 pt-4">
          <h1 className="text-bb-title text-sky-ink">하늘님의 아늑한 집</h1>
          <p className="text-bb-body text-sky-muted">오늘도 내 속도로 산뜻하게.</p>
        </section>

        <NavRow to="/points" label="내 포인트" value={`${balance.toLocaleString()}P`} />
        <NavRow to="/space-manage" label="공간 관리" />

        <h2 className="text-bb-title text-sky-ink">추천과 알림</h2>
        <SwitchRow label="기본 추천 사용" defaultOn />
        <SwitchRow label="부드러운 추천 알림" defaultOn={false} />
        <SwitchRow label="숨은 관리 발견" defaultOn />

        <NavRow to="/help" label="도움말·서비스 정보" />

        <p className="text-bb-caption text-sky-muted">뽀득뽀득 · 버전 0.1.0</p>
        {/* No standalone motion demo exists; home cards carry the press + glass shine. */}
        <Link className="self-start text-bb-caption text-sky-deep" to="/home">
          터치·유리광 효과 체험 →
        </Link>
        <Link className="flex h-11 items-center justify-center text-bb-label text-sky-deep" to="/help">
          기록·공간 이용 안내&nbsp;&nbsp;›
        </Link>
      </main>
    </PageShell>
  );
}
