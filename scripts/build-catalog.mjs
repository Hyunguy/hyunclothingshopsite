import { mkdir, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";
import axios from "axios";

const root = fileURLToPath(new URL("../public/api/", import.meta.url));
const categories = [
  ["mens-shirts", "Men’s shirts"],
  ["womens-dresses", "Dresses"],
  ["tops", "Tops"],
  ["mens-shoes", "Men’s shoes"],
  ["womens-shoes", "Women’s shoes"],
  ["womens-bags", "Bags"],
];
const shopNames = [
  "Hyun Archive",
  "Common Room",
  "Sunday Studio",
  "North Supply",
  "Everyday Goods",
  "The Wardrobe",
  "Studio Eight",
  "Second Season",
  "Good Company",
  "Field Store",
  "Neighbourhood",
  "Off Hours",
];
const write = async (name, value) => {
  const target = path.join(root, name + ".json");
  await mkdir(path.dirname(target), { recursive: true });
  await writeFile(target, JSON.stringify(value, null, 2) + "\n");
};
// Fetch real sample clothing data. Marketplace-only fields below are documented demo fixtures.
const responses = await Promise.all(
  categories.map(async ([slug]) => {
    const { data } = await axios.get(
      "https://dummyjson.com/products/category/" + slug,
      {
        params: { limit: 0 },
        timeout: 20000,
      },
    );
    if (!Array.isArray(data.products) || !data.products.length)
      throw new Error("Empty category: " + slug);
    return data.products;
  }),
);
// Interleave categories so the opening page is a mix of garments and accessories.
const products = [];
for (let i = 0; i < Math.max(...responses.map((r) => r.length)); i++) {
  responses.forEach((items) => {
    if (items[i]) products.push(items[i]);
  });
}
const sellers = shopNames.map((name, index) => ({
  id: index + 1,
  name,
  handle: name.toLowerCase().replaceAll(" ", "-"),
  followers: [632, 481, 375, 291, 260, 244, 219, 198, 154, 120, 96, 73][index],
  sales: [
    4820, 4355, 3980, 3510, 3125, 2880, 2435, 2195, 1830, 1525, 1195, 980,
  ][index],
  description: "A sample seller profile in the Eventide clothing marketplace.",
  image: products[index % products.length].thumbnail,
}));
const items = products.map((p, index) => ({
  ...p,
  categoryName: categories.find((c) => c[0] === p.category)[1],
  seller: sellers[index % sellers.length],
  creator: sellers[(index + 4) % sellers.length],
  likes: [69, 99, 17, 16, 14, 74, 42, 32, 58, 27, 81, 35][index % 12],
  views: 120 + index * 37,
  // Fixed dates: never restart an expired timer on refresh. These are sample timed listings.
  expiresAt:
    index % 3 === 0
      ? Date.parse("2026-12-15T20:00:00Z") + index * 3600000
      : null,
}));
const collections = categories.map(([id, name]) => ({
  id,
  name,
  code: id.toUpperCase(),
  items: items.filter((p) => p.category === id),
  featured: items.find((p) => p.category === id),
}));
await write("hot-collections", collections);
await write(
  "new-items",
  [...items]
    .sort((a, b) => Date.parse(b.meta.createdAt) - Date.parse(a.meta.createdAt))
    .slice(0, 7),
);
await write("top-sellers", sellers);
await write("explore/default", items);
await write(
  "explore/price_low_to_high",
  [...items].sort((a, b) => a.price - b.price),
);
await write(
  "explore/price_high_to_low",
  [...items].sort((a, b) => b.price - a.price),
);
await write(
  "explore/likes_high_to_low",
  [...items].sort((a, b) => b.likes - a.likes),
);
for (const item of items) await write("item-details/" + item.id, item);
for (const seller of sellers)
  await write("author/" + seller.id, {
    ...seller,
    items: items.filter((item) => item.seller.id === seller.id),
    createdItems: items.filter((item) => item.creator.id === seller.id),
  });
for (const collection of collections)
  await write("collection/" + collection.id, collection);
await write("manifest", {
  source: "https://dummyjson.com",
  capturedAt: new Date().toISOString(),
  itemCount: items.length,
  sellerCount: sellers.length,
  note: "Products are DummyJSON samples. Sellers, likes, views, followers, sales and expiry dates are local demo fixtures. Responses are immutable deployment snapshots, not a live commerce backend.",
});
console.log(
  "Generated " +
    items.length +
    " clothing records, six collections and twelve demo sellers.",
);
