// Recency-fade + payment-amount/recovery self-check (no test framework): `npm test`.
// Extensionless (or server-side `.js`) relative imports are resolved to .ts by the tiny hook below.
import assert from "node:assert/strict";
import { register } from "node:module";

register(
  "data:text/javascript," +
    encodeURIComponent(`export async function resolve(s, c, next) {
      try { return await next(s, c); } catch (e) { if (s.startsWith(".")) return next(s.replace(/\.js$/, "") + ".ts", c); throw e; }
    }`),
);

const { daysAgo, fadeForStaleness, itemStaleness, waterBase } = await import("../src/data/cleaning.ts");

// Policy stops: 100/72/48/28% at 0 / 0.6 / 0.85 / ≥1.1 of the cycle.
assert.equal(fadeForStaleness(0), 1);
assert.equal(fadeForStaleness(0.6), 0.72);
assert.equal(fadeForStaleness(0.85), 0.48);
assert.ok(Math.abs(fadeForStaleness(1.1) - 0.28) < 1e-9);
assert.equal(fadeForStaleness(5), 0.28);
assert.equal(fadeForStaleness(-1), 1);

// Never recorded → no tint (plain Surface); recorded at least once → 18% base tint.
assert.equal(waterBase("bathroom", 0), undefined);
assert.ok(waterBase("bathroom", 0.28)?.startsWith("rgb("));

// Monotonic, smooth decrease between stops.
for (let s = 0; s < 1.5; s += 0.01) assert.ok(fadeForStaleness(s + 0.01) <= fadeForStaleness(s), `not monotonic at ${s}`);

const now = new Date(2026, 9, 15, 12);
assert.equal(daysAgo(new Date(2026, 9, 15, 0, 5).toISOString(), now), 0);
assert.equal(daysAgo(new Date(2026, 9, 14, 23, 59).toISOString(), now), 1);
assert.equal(daysAgo(new Date(2026, 9, 8, 12).toISOString(), now), 7);

const item = { id: "x", name: "x", space: "kitchen", intervalDays: 10 } as Parameters<typeof itemStaleness>[0];
assert.equal(itemStaleness(item, [], now), Infinity);
assert.equal(itemStaleness(item, [{ id: "r", itemId: "x", at: new Date(2026, 9, 10, 12).toISOString() }], now), 0.5);

console.log("fade checks passed");

// Payment confirm trust boundary: only the exact space price passes validation.
const { handlePaymentConfirm, HttpError } = await import("../server/payment-confirm/handler.ts");
const { SPACE_PRICE_KRW } = await import("../src/features/payments/prices.ts");
const order = { paymentKey: "pk", orderId: "bbodeuk-test-1" };
await assert.rejects(handlePaymentConfirm({ ...order, amount: SPACE_PRICE_KRW - 1 }), (e) => e instanceof HttpError && e.status === 400);
delete process.env.TOSS_SECRET_KEY; // exact price gets past validation and stops at the missing secret (no network call)
await assert.rejects(handlePaymentConfirm({ ...order, amount: SPACE_PRICE_KRW }), (e) => !(e instanceof HttpError) && /TOSS_SECRET_KEY/.test(String(e)));
console.log("payment amount checks passed");

// Recovery: a re-confirm rejected as ALREADY_PROCESSED_PAYMENT succeeds only if the payment lookup shows this exact paid order.
process.env.TOSS_SECRET_KEY = "test_sk_stub";
const realFetch = globalThis.fetch;
const stubToss = (lookup: Record<string, unknown>) => {
  globalThis.fetch = (async (url: string) =>
    String(url).endsWith("/confirm")
      ? new Response(JSON.stringify({ code: "ALREADY_PROCESSED_PAYMENT", message: "이미 처리된 결제 입니다." }), { status: 400 })
      : new Response(JSON.stringify(lookup), { status: 200 })) as typeof fetch;
};
const paid = { ...order, amount: SPACE_PRICE_KRW };
stubToss({ status: "DONE", orderId: order.orderId, totalAmount: SPACE_PRICE_KRW });
assert.deepEqual(await handlePaymentConfirm(paid), { orderId: order.orderId, amount: SPACE_PRICE_KRW });
stubToss({ status: "DONE", orderId: order.orderId, totalAmount: SPACE_PRICE_KRW + 1 });
await assert.rejects(handlePaymentConfirm(paid), (e) => e instanceof HttpError && e.status === 400);
stubToss({ status: "DONE", orderId: "other-order-1", totalAmount: SPACE_PRICE_KRW });
await assert.rejects(handlePaymentConfirm(paid), (e) => e instanceof HttpError && e.status === 400);
globalThis.fetch = realFetch;
delete process.env.TOSS_SECRET_KEY;
console.log("payment recovery checks passed");
