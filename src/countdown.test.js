import test from "node:test";
import assert from "node:assert/strict";
import { remainingTime } from "./countdown.js";
import { resourcePath } from "./api.js";
test("countdown uses milliseconds and preserves hours beyond a day", () => {
  assert.deepEqual(remainingTime(90061000, 0), {
    hours: 25,
    minutes: 1,
    seconds: 1,
  });
  assert.deepEqual(remainingTime(1000, 1000), {
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  assert.deepEqual(remainingTime(1000, 2000), {
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  assert.equal(remainingTime(undefined, 0), null);
});
test("course endpoints use the correct query parameters", () => {
  assert.equal(resourcePath("authors", 73855012), "/authors?author=73855012");
  assert.equal(
    resourcePath("itemDetails", 17914494),
    "/itemDetails?nftId=17914494",
  );
  assert.equal(
    resourcePath("explore", "likes_high_to_low"),
    "/explore?filter=likes_high_to_low",
  );
  assert.throws(() => resourcePath("authors", "../"));
  assert.throws(() => resourcePath("explore", "unknown"));
});
