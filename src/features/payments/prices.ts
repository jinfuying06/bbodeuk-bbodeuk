/**
 * 추가 공간 1개의 원화 결제 금액(KRW, 1회 결제로 계속 사용). 클라이언트와 결제 승인 서버(server/payment-confirm)가
 * 이 값 하나를 같이 쓴다 — 서버는 이 금액이 아닌 승인을 거절한다. (DOM/Vite 의존 없는 순수 모듈로 유지할 것)
 */
export const SPACE_PRICE_KRW = 3000;

/**
 * 가격 미확정(2026-10-16): false인 동안 화면에는 금액을 쓰지 않는다(결제 금액 자체는 위 값을 그대로 쓴다).
 * 출시 전 반드시 true로 — 결제 확인창은 결제 전에 금액을 보여줘야 한다.
 */
export const SPACE_PRICE_FINAL = false;
