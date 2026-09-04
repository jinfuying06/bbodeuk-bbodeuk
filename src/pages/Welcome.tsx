import { Link } from "react-router-dom";
import BrandLogo from "../components/BrandLogo";
import PageShell from "../components/PageShell";

export default function Welcome() {
  return (
    <PageShell bottomNav={false}>
      <main className="flex min-h-[100dvh] flex-col px-margin-screen pb-space-2xl pt-space-xl">
        <section className="relative flex flex-1 flex-col items-center pt-[96px] text-center">
          <div className="pointer-events-none absolute top-2 h-64 w-64 rounded-full bg-primary-fixed/30 blur-3xl" />
          <div className="relative mb-space-lg flex h-28 w-28 items-center justify-center rounded-full bg-surface-container-lowest p-2 shadow-sm">
            <div className="absolute inset-0 scale-110 rounded-full bg-secondary-fixed/40 blur-md" />
            <BrandLogo className="relative h-full w-full rounded-xl" />
          </div>
          <h1 className="mb-space-sm whitespace-pre-line text-headline-lg text-on-surface">
            뽀득뽀득
          </h1>
          <br></br>
          <h3 className="mb-space-sm whitespace-pre-line text-headline-lg text-on-surface">
            한 곳만 색칠해도 오늘 청소는 성공.
          </h3>
          <p className="mb-space-2xl text-body-md leading-relaxed text-on-surface-variant">
            해야 할 일을 쌓아두는 체크리스트 대신, 내가 돌본 집의 흔적을 맑은 색으로 채워보세요.
          </p>
        </section>
        <div className="pb-[72px]">
          <Link className="flex h-14 items-center justify-center rounded-full bg-primary text-title-sm text-on-primary shadow-md" to="/setup">
            게스트로 시작하기
          </Link>
        </div>
      </main>
    </PageShell>
  );
}
