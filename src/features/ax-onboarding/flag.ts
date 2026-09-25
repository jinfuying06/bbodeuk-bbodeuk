/**
 * AX 온보딩(SECTION 19, 사진 기반 공간/아이템 인식) 기능 전체를 켜고 끄는 단일 스위치.
 *
 * 분리 원칙:
 * - 이 폴더(src/features/ax-onboarding/) 밖의 코드는 이 파일과 index.ts에서 export하는 것만 참조한다.
 * - 기존 화면(Setup.tsx 등)은 이 기능으로 들어가는 진입점(버튼/링크) 1곳과
 *   라우터(App.tsx) 1줄만 추가로 가진다. 그 외 기존 화면 로직은 건드리지 않는다.
 * - 백엔드(사진 인식 API 프록시)도 이 저장소의 정적 배포(GitHub Pages)와는
 *   별도 폴더·별도 배포로 관리한다(server/ax-recognize/ 등, src/ 밖).
 *
 * 기능을 완전히 뗄 때:
 * 1) 이 폴더(src/features/ax-onboarding/) 전체 삭제
 * 2) App.tsx의 AX 라우트 1줄 삭제
 * 3) Setup.tsx의 진입 버튼(AX_ONBOARDING_ENABLED로 감싼 블록) 삭제
 * 4) server/ax-recognize/ 전체 삭제(로컬 dev 브릿지 포함) + vite.config.ts의 axRecognizeDevPlugin() 1줄 삭제
 * 5) 별도 배포된 프로덕션 백엔드 프록시(vercel.ts 등) 삭제
 */
export const AX_ONBOARDING_ENABLED = true;
