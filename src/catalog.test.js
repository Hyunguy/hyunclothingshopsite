import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { changeBag, money } from "./catalog.js";
import {
  remainingTime,
  visibleItems,
  validateResponse,
} from "./marketplace.js";

const read = async (name) =>
  JSON.parse(
    await readFile(
      new URL("../public/api/" + name + ".json", import.meta.url),
      "utf8",
    ),
  );
test("bag merges quantities, respects stock, and removes zero quantities", () => {
  const product = { id: 1, price: 29.99, stock: 2 };
  const one = changeBag([], product, 1);
  const two = changeBag(one, product, 5);
  assert.equal(two.length, 1);
  assert.equal(two[0].quantity, 2);
  assert.equal(one[0].quantity, 1);
  assert.deepEqual(changeBag(two, product, -2), []);
  assert.deepEqual(changeBag([], { ...product, stock: 0 }, 1), []);
  assert.equal(money(29.99), "$29.99");
});
test("countdown handles hours above 24, exact expiry and absent values", () => {
  assert.deepEqual(remainingTime(90061000, 0), {
    expired: false,
    hours: 25,
    minutes: 1,
    seconds: 1,
  });
  assert.deepEqual(remainingTime(1000, 1000), {
    expired: true,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  assert.equal(remainingTime(null, 0), null);
  assert.equal(remainingTime("invalid", 0), null);
  assert.equal(remainingTime(1000, 2000).expired, true);
});
test("Explore responses are remotely ordered and retain every record", async () => {
  const all = await read("explore/default");
  assert.ok(all.length >= 16);
  assert.equal(new Set(all.map((p) => p.id)).size, all.length);
  for (const [name, field, sign] of [
    ["price_low_to_high", "price", 1],
    ["price_high_to_low", "price", -1],
    ["likes_high_to_low", "likes", -1],
  ]) {
    const items = await read("explore/" + name);
    assert.deepEqual(
      items.map((p) => p.id).sort(),
      all.map((p) => p.id).sort(),
    );
    for (let i = 1; i < items.length; i++)
      assert.ok((items[i][field] - items[i - 1][field]) * sign >= 0);
  }
});
test("each item and collection links to the matching seller, creator and detail response", async () => {
  const all = await read("explore/default");
  for (const item of all) {
    assert.deepEqual(await read("item-details/" + item.id), item);
    const seller = await read("author/" + item.seller.id);
    const creator = await read("author/" + item.creator.id);
    assert.ok(seller.items.some((p) => p.id === item.id));
    assert.ok(creator.createdItems.some((p) => p.id === item.id));
    validateResponse("item-details/" + item.id, item);
    validateResponse("author/" + seller.id, seller);
  }
  const collections = await read("hot-collections");
  assert.equal(collections.length, 6);
  for (const collection of collections) {
    assert.ok(collection.items.every((p) => p.category === collection.id));
    assert.ok(collection.items.some((p) => p.id === collection.featured.id));
  }
  assert.equal((await read("top-sellers")).length, 12);
  assert.equal((await read("new-items")).length, 7);
});
test("search and filters compose while preserving API order", async () => {
  const all = await read("explore/price_low_to_high");
  const result = visibleItems(all, "shirt", "mens-shirts", true);
  assert.ok(result.length > 0);
  assert.ok(result.every((p) => p.category === "mens-shirts" && p.stock > 0));
  assert.deepEqual(
    result,
    [...result].sort((a, b) => a.price - b.price),
  );
  assert.deepEqual(visibleItems(all, "does not exist"), []);
});
test("invalid API payloads are rejected before rendering", () => {
  assert.throws(() => validateResponse("explore/default", {}));
  assert.throws(() => validateResponse("author/1", { id: 1, name: "Seller" }));
  assert.throws(() =>
    validateResponse("item-details/1", {
      id: 1,
      title: "Item",
      price: "wrong",
    }),
  );
  assert.throws(() => validateResponse("top-sellers", [null]));
});
