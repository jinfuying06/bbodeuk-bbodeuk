import { Component, ReactNode } from "react";
import GlassButton from "./GlassButton";

/** Last-resort fallback so a render error shows a way back instead of a blank page. */
export default class ErrorBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  render() {
    if (!this.state.failed) return this.props.children;
    return (
      <div className="phone-shell flex flex-col items-center justify-center gap-4 bg-sky-bg px-margin-screen text-center text-sky-ink">
        <h1 className="text-bb-title">잠시 문제가 생겼어요</h1>
        <p className="text-bb-body text-sky-muted">홈으로 돌아가 다시 시도해 주세요.</p>
        <GlassButton className="w-full" onClick={() => window.location.assign(import.meta.env.BASE_URL)}>
          홈으로
        </GlassButton>
      </div>
    );
  }
}
