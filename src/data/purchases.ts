// ponytail: 구매 내역은 이 브라우저의 localStorage에만 있다(기기 변경 시 사라짐). 계정과 서버 측 구매 내역이 생기면 그쪽을 단일 출처로 옮길 것.
// 유료 데이터라 설정의 "데이터 초기화"에서도 지우지 않는다(Settings.tsx resetAllData).
export const PURCHASES_KEY = "bbodeuk.purchases.v1";

type Purchases = { spaces: string[]; orderIds: string[] };

function readPurchases(): Purchases {
  try {
    const parsed = JSON.parse(window.localStorage.getItem(PURCHASES_KEY) ?? "{}") as Partial<Purchases>;
    return { spaces: Array.isArray(parsed.spaces) ? parsed.spaces : [], orderIds: Array.isArray(parsed.orderIds) ? parsed.orderIds : [] };
  } catch {
    return { spaces: [], orderIds: [] };
  }
}

/** 이미 결제한 추가 공간(EXPANSION_CATALOG key)인지 — 껐다 다시 켤 때 다시 결제하지 않게. */
export function isSpacePurchased(key: string): boolean {
  return readPurchases().spaces.includes(key);
}

/** 이미 공간을 연 주문인지 — 새로고침으로 같은 successUrl에 다시 와도 두 번 처리하지 않게. */
export function isOrderRecorded(orderId: string): boolean {
  return readPurchases().orderIds.includes(orderId);
}

/** 서버 승인이 끝난 결제를 기록한다. */
export function recordSpacePurchase(key: string, orderId: string): void {
  const current = readPurchases();
  const next = {
    spaces: current.spaces.includes(key) ? current.spaces : [...current.spaces, key],
    orderIds: current.orderIds.includes(orderId) ? current.orderIds : [...current.orderIds, orderId],
  };
  try {
    window.localStorage.setItem(PURCHASES_KEY, JSON.stringify(next));
  } catch {
    // no-op: prototype has no server fallback
  }
}
