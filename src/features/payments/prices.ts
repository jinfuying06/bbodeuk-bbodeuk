/**
 * 추가 공간 1개의 원화 결제 금액(KRW, 1회 결제로 계속 사용). 클라이언트와 결제 승인 서버(server/payment-confirm)가
 * 이 값 하나를 같이 쓴다 — 서버는 이 금액이 아닌 승인을 거절한다. (DOM/Vite 의존 없는 순수 모듈로 유지할 것)
 */
export const SPACE_PRICE_KRW = 3000;
