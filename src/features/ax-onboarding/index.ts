/**
 * 이 기능 밖(Setup.tsx, App.tsx)에서는 반드시 이 파일을 통해서만 import한다.
 * 폴더 내부 파일을 바깥에서 직접 import하지 않는다 — 그래야 폴더를 통째로 지울 때
 * 바깥 코드에서 깨지는 지점이 이 파일 하나로만 좁혀진다.
 */
export { AX_ONBOARDING_ENABLED } from "./flag";
export { default as AXOnboardingFlow } from "./AXOnboardingFlow";
