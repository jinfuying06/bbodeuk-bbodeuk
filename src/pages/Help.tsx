import { Link } from "react-router-dom";
import AppHeader from "../components/AppHeader";
import PageShell from "../components/PageShell";

const faqs: Array<[string, string[]]> = [
  ["색이 옅어지는 건 무슨 뜻인가요?", ["시간이 흐르며 기록의 색이 옅어져요.", "청결 점수나 벌점은 아니에요."]],
  ["기록을 잘못 눌렀어요", ["청소 카드를 다시 누르면 취소할 수 있어요."]],
  ["포인트는 어디에 쓰나요?", ["기본 공간은 무료예요. 추가 공간은", "1개당 300P로 열 수 있어요."]],
];

/** Figma 31 / 도움말 (32:1263). */
export default function Help() {
  return (
    <PageShell>
      <AppHeader title="도움말" back="/settings" />
      <main className="flex flex-col gap-3 px-margin-screen pb-nav pt-header">
        <div className="flex h-[88px] flex-col gap-2">
          <h1 className="text-bb-heading text-sky-ink">가볍게 시작하는 뽀득뽀득</h1>
          <p className="text-bb-body text-sky-muted">작은 기록에 대한 궁금한 점을 모았어요.</p>
        </div>
        {faqs.map(([question, answer]) => (
          <section key={question} className="flex min-h-[112px] flex-col gap-2 rounded-3xl bg-sky-white px-5 pb-4 pt-4">
            <h2 className="text-bb-title text-sky-ink">{question}</h2>
            <p className="text-bb-body text-sky-muted">
              {answer.map((line) => (
                <span key={line} className="block">
                  {line}
                </span>
              ))}
            </p>
          </section>
        ))}
        <Link className="flex h-11 items-center justify-center text-bb-label text-sky-deep" to="/settings">
          설정으로 돌아가기
        </Link>
      </main>
    </PageShell>
  );
}
