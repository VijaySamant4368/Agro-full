/**
 * Self-check for the money path. Run with: npm run check
 * ponytail: assert-based, no test framework — grow it into a real suite only
 * if the pricing rules stop fitting in one screen.
 */
import assert from "node:assert/strict";
import { SERVICE_FEE_PER_NIGHT, TAX_RATE, quote } from "./pricing.ts";
import { nightsBetween } from "./utils.ts";

// nightsBetween
assert.equal(nightsBetween("2026-09-15", "2026-09-18"), 3);
assert.equal(nightsBetween("2026-09-15", "2026-09-15"), 0, "same day is zero nights");
assert.equal(nightsBetween("2026-09-18", "2026-09-15"), 0, "reversed range never goes negative");
assert.equal(nightsBetween("", "2026-09-18"), 0, "missing date is zero, not NaN");
assert.equal(nightsBetween("not-a-date", "2026-09-18"), 0, "unparseable date is zero, not NaN");

// quote
const q = quote(4500, 3);
assert.equal(q.stay, 13_500);
assert.equal(q.serviceFee, 3 * SERVICE_FEE_PER_NIGHT);
assert.equal(q.taxes, Math.round(13_500 * TAX_RATE));
assert.equal(q.total, q.stay + q.serviceFee + q.taxes);

// A zero-night quote must cost nothing — the booking button is disabled on it.
assert.deepEqual(quote(4500, 0), { nights: 0, stay: 0, serviceFee: 0, taxes: 0, total: 0 });

console.log("pricing checks passed");
