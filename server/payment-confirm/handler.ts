import { SPACE_PRICE_KRW } from "../../src/features/payments/prices.js";

/**
 * 추가 공간 원화 결제 승인 프록시 핵심 로직(토스페이먼츠 v1 결제 승인 API).
 * 계약: POST { paymentKey, orderId, amount } → 200 { orderId, amount } | 4xx/5xx { error }.
 * TOSS_SECRET_KEY는 서버에서만 읽는다(절대 VITE_ 접두사로 두지 않는다).
 * 이 파일은 플랫폼 비종속. 배포 어댑터는 vercel.ts 참고.
 */

/** 어댑터가 status를 그대로 HTTP 응답 코드로 쓰고, message만 클라이언트에 노출하는 에러. */
export class HttpError extends Error {
  status: number; // plain field (not a parameter property) so `npm test` can load this file with type stripping
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

export type PaymentConfirmResponse = { orderId: string; amount: number };

export async function handlePaymentConfirm(body: unknown): Promise<PaymentConfirmResponse> {
  // 신뢰 경계: 금액은 반드시 공간 1개 가격과 정확히 같아야 한다 — 클라이언트가 바꾼 금액은 승인하지 않는다.
  const { paymentKey, orderId, amount } = (body ?? {}) as Record<string, unknown>;
  if (
    typeof paymentKey !== "string" ||
    paymentKey.length < 1 ||
    paymentKey.length > 200 ||
    typeof orderId !== "string" ||
    !/^[A-Za-z0-9_=-]{6,64}$/.test(orderId) ||
    typeof amount !== "number" ||
    amount !== SPACE_PRICE_KRW
  ) {
    throw new HttpError(400, "결제 요청 형식이 올바르지 않아요");
  }

  const secretKey = process.env.TOSS_SECRET_KEY;
  if (!secretKey) throw new Error("TOSS_SECRET_KEY가 설정되지 않았습니다"); // 설정 오류 → 어댑터에서 500

  // ponytail: 주문(orderId↔공간)을 서버에 저장하지 않아 구매 내역은 브라우저에만 남는다.
  // 계정과 서버 측 구매 내역이 생기면 주문 생성 시 저장하고 여기서 대조·기록할 것.
  const authorization = `Basic ${Buffer.from(`${secretKey}:`).toString("base64")}`;
  let response: Response;
  try {
    response = await fetch("https://api.tosspayments.com/v1/payments/confirm", {
      method: "POST",
      headers: {
        Authorization: authorization,
        "Content-Type": "application/json",
        // 멱등키를 두지 않는다 — 같은 결제를 두 번 승인하면 토스가 ALREADY_PROCESSED_PAYMENT로 거절해 중복 처리를 막는다.
      },
      body: JSON.stringify({ paymentKey, orderId, amount }),
    });
  } catch (error) {
    console.error("토스 결제 승인 호출 실패", error);
    throw new HttpError(502, "결제 승인 서버에 연결하지 못했어요");
  }

  const result = (await response.json().catch(() => null)) as { code?: string; message?: string; status?: string } | null;
  // 이전 승인 응답이 브라우저에 닿지 못한 재시도(새로고침·네트워크 끊김): 결제 조회로 이 주문이 정말 완료됐는지 확인한다.
  if (!response.ok && result?.code === "ALREADY_PROCESSED_PAYMENT" && (await isPaidOrder(paymentKey, orderId, authorization))) {
    return { orderId, amount };
  }
  if (!response.ok) {
    // 토스 에러 메시지는 사용자용 한국어 문구라 그대로 전달한다.
    const status = response.status >= 500 ? 502 : 400;
    throw new HttpError(status, result?.message ?? `결제를 승인하지 못했어요 (${result?.code ?? response.status})`);
  }
  if (result?.status !== "DONE") {
    throw new HttpError(400, "결제가 완료되지 않았어요");
  }
  return { orderId, amount };
}

/**
 * 토스 결제 조회(GET /v1/payments/{paymentKey}): 이 주문이 정확한 금액으로 완료(DONE)된 결제인지.
 * 조회 서버에 닿지 못하면 502 — 클라이언트가 대기 중인 결제를 지우지 않고 나중에 다시 확인하게.
 */
async function isPaidOrder(paymentKey: string, orderId: string, authorization: string): Promise<boolean> {
  let lookup: Response;
  try {
    lookup = await fetch(`https://api.tosspayments.com/v1/payments/${encodeURIComponent(paymentKey)}`, {
      headers: { Authorization: authorization },
    });
  } catch (error) {
    console.error("토스 결제 조회 호출 실패", error);
    throw new HttpError(502, "결제 승인 서버에 연결하지 못했어요");
  }
  if (lookup.status >= 500) throw new HttpError(502, "결제 승인 서버에 연결하지 못했어요");
  if (!lookup.ok) return false;
  const payment = (await lookup.json().catch(() => null)) as { status?: string; orderId?: string; totalAmount?: number } | null;
  return payment?.status === "DONE" && payment.orderId === orderId && payment.totalAmount === SPACE_PRICE_KRW;
}
