/**
 * 토스페이먼츠 v2 결제창(추가 공간 원화 결제)의 유일한 연결 지점.
 *
 * - VITE_TOSS_CLIENT_KEY(API 개별 연동 키, test_ck_/live_ck_)와 VITE_PAYMENT_CONFIRM_URL(server/payment-confirm)이
 *   둘 다 빌드 시점에 설정돼 있어야 PAYMENTS_READY가 켜진다. 아니면 UI는 "준비 중"으로 가려진다.
 * - SDK는 npm 의존성 없이 공식 스크립트를 필요할 때 한 번만 불러온다.
 * - 시크릿 키는 절대 여기 두지 않는다 — 승인(confirm)은 서버만 한다.
 */
import { SPACE_PRICE_KRW } from "./prices";

const CLIENT_KEY: string | undefined = import.meta.env.VITE_TOSS_CLIENT_KEY || undefined;
const CONFIRM_URL: string | undefined = import.meta.env.VITE_PAYMENT_CONFIRM_URL || undefined;
const SDK_URL = "https://js.tosspayments.com/v2/standard";
const CUSTOMER_KEY_STORAGE = "bbodeuk.payments.customerKey.v1";

export const PAYMENTS_READY = Boolean(CLIENT_KEY) && Boolean(CONFIRM_URL);

type TossPaymentsFactory = (clientKey: string) => {
  payment: (options: { customerKey: string }) => {
    requestPayment: (request: {
      method: "CARD";
      amount: { currency: "KRW"; value: number };
      orderId: string;
      orderName: string;
      successUrl: string;
      failUrl: string;
    }) => Promise<void>;
  };
};

let sdkPromise: Promise<TossPaymentsFactory> | null = null;
function loadSdk(): Promise<TossPaymentsFactory> {
  sdkPromise ??= new Promise<TossPaymentsFactory>((resolve, reject) => {
    const script = document.createElement("script");
    script.src = SDK_URL;
    script.onload = () => {
      const factory = (window as unknown as { TossPayments?: TossPaymentsFactory }).TossPayments;
      if (factory) resolve(factory);
      else reject(new Error("결제 모듈을 불러오지 못했어요"));
    };
    script.onerror = () => reject(new Error("결제 모듈을 불러오지 못했어요"));
    document.head.appendChild(script);
  }).catch((error: unknown) => {
    sdkPromise = null; // 네트워크 실패 후 다시 누르면 재시도할 수 있게
    throw error;
  });
  return sdkPromise;
}

// ponytail: 로그인 서버가 없어 브라우저마다 무작위 고객 키를 쓴다. 회원 계정이 생기면 서버의 사용자 id 기반 키로 바꿀 것.
function customerKey(): string {
  try {
    const stored = window.localStorage.getItem(CUSTOMER_KEY_STORAGE);
    if (stored) return stored;
    const key = crypto.randomUUID();
    window.localStorage.setItem(CUSTOMER_KEY_STORAGE, key);
    return key;
  } catch {
    return "ANONYMOUS";
  }
}

/**
 * 토스 결제창으로 이동한다(리다이렉트). 돌아오면 /space-manage?payment=success|fail&space=<key> 로 온다.
 * `space`는 EXPANSION_CATALOG key(예: "베란다 / 다용도실") — 쿼리에 안전하게 인코딩한다.
 */
export async function requestSpacePayment(spaceKey: string, spaceLabel: string): Promise<void> {
  if (!CLIENT_KEY) throw new Error("결제가 아직 준비되지 않았어요");
  const TossPayments = await loadSdk();
  const back = (result: string) =>
    `${window.location.origin}${import.meta.env.BASE_URL}space-manage?payment=${result}&space=${encodeURIComponent(spaceKey)}`;
  await TossPayments(CLIENT_KEY)
    .payment({ customerKey: customerKey() })
    .requestPayment({
      method: "CARD",
      amount: { currency: "KRW", value: SPACE_PRICE_KRW },
      orderId: `bbodeuk-${crypto.randomUUID()}`, // 6~64자, 영문/숫자/-_= 만
      orderName: `추가 공간: ${spaceLabel}`,
      successUrl: back("success"),
      failUrl: back("fail"),
    });
}

/** 토스 failUrl의 code → 고정 안내 문구(없는 code는 기본 문구). 쿼리의 message는 누구나 조작할 수 있어 쓰지 않는다. */
const FAIL_MESSAGES = new Map([
  ["PAY_PROCESS_CANCELED", "결제를 취소했어요"],
  ["USER_CANCEL", "결제를 취소했어요"],
  ["REJECT_CARD_COMPANY", "카드사에서 결제를 거절했어요"],
]);

export function paymentFailMessage(code: string | null): string {
  return FAIL_MESSAGES.get(code ?? "") ?? "결제가 완료되지 않았어요. 다시 시도해 주세요";
}

export type PendingPayment = { paymentKey: string; orderId: string; amount: number; space: string };

/** 승인 전에 저장해 두는 결제 1건 — 승인 응답을 못 받아도(네트워크 끊김·탭 닫힘) 다음 방문에 다시 확인한다. 데이터 초기화에서도 지우지 않는다. */
export const PENDING_PAYMENT_KEY = "bbodeuk.payments.pending.v1";

export function readPendingPayment(): PendingPayment | null {
  try {
    const parsed = JSON.parse(window.localStorage.getItem(PENDING_PAYMENT_KEY) ?? "null") as Partial<PendingPayment> | null;
    if (typeof parsed?.paymentKey !== "string" || typeof parsed.orderId !== "string" || typeof parsed.amount !== "number" || typeof parsed.space !== "string") return null;
    return parsed as PendingPayment;
  } catch {
    return null;
  }
}

export function savePendingPayment(pending: PendingPayment): void {
  try {
    window.localStorage.setItem(PENDING_PAYMENT_KEY, JSON.stringify(pending));
  } catch {
    // no-op: 저장 못 하면 successUrl 쿼리가 유일한 복구 단서다(재시도 가능 오류에선 쿼리를 지우지 않는다).
  }
}

export function clearPendingPayment(): void {
  try {
    window.localStorage.removeItem(PENDING_PAYMENT_KEY);
  } catch {
    // no-op
  }
}

/** 승인 실패. retryable이면 결과를 모르는 상태(네트워크·5xx)라 대기 중인 결제를 지우지 말아야 한다. */
export class PaymentConfirmError extends Error {
  retryable: boolean;
  constructor(message: string, retryable: boolean) {
    super(message);
    this.retryable = retryable;
  }
}

/** 서버(server/payment-confirm)에 승인을 요청한다. 실패하면 PaymentConfirmError를 던진다. */
export async function confirmPayment(paymentKey: string, orderId: string, amount: number): Promise<void> {
  if (!CONFIRM_URL) throw new PaymentConfirmError("결제가 아직 준비되지 않았어요", true);
  let response: Response;
  try {
    response = await fetch(CONFIRM_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ paymentKey, orderId, amount }),
    });
  } catch {
    throw new PaymentConfirmError("결제 승인 서버에 연결하지 못했어요", true);
  }
  if (response.ok) return;
  const body = (await response.json().catch(() => null)) as { error?: string } | null;
  // 429(rate limit)도 결과를 모르는 상태라 재시도 대상이다.
  const retryable = response.status >= 500 || response.status === 429;
  throw new PaymentConfirmError((body?.error ?? `결제를 승인하지 못했어요 (${response.status})`).slice(0, 80), retryable);
}
