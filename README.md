# 뽀득뽀득

> 한 곳만 칠해도, 오늘 청소는 성공.

공간별로 청소 기록을 남기면, 오래 돌보지 않은 곳일수록 공간 색이 서서히 옅어지는 청소 기록 서비스의 모바일 웹 프로토타입입니다. (React · TypeScript · Vite · Tailwind CSS)

- 바로 써보기: https://jinfuying06.github.io/bbodeuk-bbodeuk/

## 실행

```bash
npm install
npm run dev     # 개발 서버
npm run build   # 프로덕션 빌드 (dist/)
npm test        # 색 바램(recency-fade) 로직 점검
```

## 데이터 저장

별도 서버 없이 모든 데이터(청소 기록, 공간 설정, 구매한 추가 공간 등)는 **브라우저 localStorage에만** 저장됩니다. 다른 기기·브라우저와는 공유되지 않습니다.

처음부터 다시 시작하려면 **설정 → 데이터 초기화**를 누르세요.

## 배포

`main` 브랜치에 push하면 GitHub Actions(`.github/workflows/deploy.yml`)가 테스트·빌드 후 GitHub Pages로 배포합니다.

## 결제·AI 인식 연동

결제(추가 공간 1개 3,000원 원화 결제)와 AI 사진 인식은 코드가 완성돼 있고, 키가 없으면 해당 영역이 "준비중"으로 가려집니다. 키만 넣으면 열립니다.

1. 키 발급: 토스페이먼츠 개발자센터에서 **API 개별 연동 키**(클라이언트 `test_ck_…`/`live_ck_…`, 시크릿 `test_sk_…`/`live_sk_…` — 위젯 키 `gck`가 아님, 공개 테스트 키로 먼저 시험 가능), Anthropic Console에서 `ANTHROPIC_API_KEY`.
2. 서버 배포(Vercel): 저장소를 Vercel에 연결해 배포합니다(`api/` 폴더가 서버 함수로 배포됨).
3. Vercel 환경변수(서버 전용, VITE_ 금지): `TOSS_SECRET_KEY`, `ANTHROPIC_API_KEY`.
4. GitHub 저장소 Settings → Secrets and variables → Actions → **Variables**에 `VITE_TOSS_CLIENT_KEY`, `VITE_PAYMENT_CONFIRM_URL`(예: `https://<프로젝트>.vercel.app/api/payment/confirm`), `VITE_AX_RECOGNIZE_URL`(예: `.../api/ax/recognize`)을 넣고 main에 다시 배포하면 빌드에 반영됩니다.
5. AI 항목 자동완성(선택): Vercel 환경변수 `TYPESAFE_API_KEY`, GitHub Variables `VITE_API_BASE`(예: `https://<프로젝트>.vercel.app`, 경로 없이 도메인만)를 넣습니다. 미설정이어도 항목 추가는 수동 입력으로 동작합니다.
6. 다른 도메인에서 호출한다면 `server/*/vercel.ts`의 `ALLOWED_ORIGINS`에 추가하세요(localhost 출처는 운영(`VERCEL_ENV=production`) 배포에서 자동으로 빠짐).
   사진 설정 화면에는 "사진은 외부 AI(Anthropic)로 전송되며 인식 후 저장하지 않는다"는 안내 문구가 표시됩니다.
7. 로컬: `.env.example`을 `.env`로 복사해 값을 채우고 `npm run dev`(로컬 주소는 `/api/payment/confirm`, `/api/ax/recognize`, `/api/item-classify`).
8. 추가 공간 가격(`SPACE_PRICE_KRW`)은 `src/features/payments/prices.ts` 한 곳에서 바꿉니다(클라이언트·서버 공용, 서버는 이 금액만 승인).
9. 실결제를 켜기 전 조건: 계정 + 서버 측 구매 내역 저장(현재는 브라우저에만 저장되어 기기 변경 시 구매가 사라짐).
10. 출시 전 필수: Vercel/Anthropic 콘솔에서 요청 rate limit과 지출 한도 설정.
11. 출시 전 필수: `/api/payment/confirm`에 rate limit(예: Vercel Firewall 10 req/min/IP).
12. Vercel Preview 환경에는 `test_sk_…` 키만 넣습니다(`live_sk_…`는 Production 전용).
13. 실결제 전 이용약관·환불 정책·사업자 정보를 앱에 링크합니다.
