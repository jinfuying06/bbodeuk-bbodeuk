import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import PhotoSetupScreen from "./PhotoSetupScreen";
import DraftReviewScreen from "./DraftReviewScreen";
import type { AXSpaceDraft } from "./types";
import type { SpaceKey } from "./itemLibrary";
import { DEFAULT_SPACES, writeSetup } from "../../data/setup";

/**
 * 이 기능의 유일한 진입/종료 지점. App.tsx는 이 컴포넌트 하나만 라우트에 연결한다.
 * 완료 시 기존 Setup.tsx와 같은 localStorage 스키마(bbodeuk.setup.v1)에 맞춰 저장하고
 * /home으로 이동한다 — 다른 화면(Spaces.tsx 등)이 이 값을 그대로 읽을 수 있어야 하므로,
 * 기존 Setup.tsx가 쓰는 한국어 라벨("침실 / 방" 포함)을 그대로 맞춘다.
 */
const SETUP_STORAGE_LABEL: Record<SpaceKey, string> = {
  living: "거실",
  kitchen: "주방",
  bathroom: "욕실",
  bedroom: "침실 / 방",
};

export default function AXOnboardingFlow() {
  const navigate = useNavigate();
  const [drafts, setDrafts] = useState<AXSpaceDraft[] | null>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [drafts === null]);

  const finishSetup = (spaceKeys: SpaceKey[]) => {
    // 욕실/주방은 Setup과 같은 규칙으로 항상 포함(필수 공간) — 사진을 안 찍었어도 빠지지 않게.
    const required = DEFAULT_SPACES.filter((space) => space.required).map((space) => space.key);
    const spaces = Array.from(new Set([...spaceKeys.map((key) => SETUP_STORAGE_LABEL[key]), ...required]));
    writeSetup({ spaces, roomName: "방" });
    navigate("/home");
  };

  // 사진 화면은 초안 확인 중에도 마운트된 채 숨겨둔다 — 초안에서 뒤로 가도 찍은 사진이 그대로 남도록.
  return (
    <>
      <div hidden={drafts !== null}>
        <PhotoSetupScreen
          onComplete={setDrafts}
          onSkip={() => navigate("/setup", { replace: true })}
          onBack={() => navigate("/setup", { replace: true })}
        />
      </div>
      {drafts ? (
        <DraftReviewScreen
          initialDrafts={drafts}
          onBack={() => setDrafts(null)}
          onConfirm={(finalDrafts) => finishSetup(finalDrafts.map((draft) => draft.spaceKey))}
        />
      ) : null}
    </>
  );
}
