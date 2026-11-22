import axios from "axios";

export const SORT_OPTIONS = [
  ["default", "Featured"],
  ["price_low_to_high", "Price: low to high"],
  ["price_high_to_low", "Price: high to low"],
  ["likes_high_to_low", "Most liked"],
];
const resourcePattern =
  /^(hot-collections|new-items|top-sellers|explore\/(default|price_low_to_high|price_high_to_low|likes_high_to_low)|author\/\d+|item-details\/\d+|collection\/[a-z-]+)$/;
export async function getResource(resource, signal) {
  if (!resourcePattern.test(resource))
    throw new Error("This page could not be found.");
  const { data } = await axios.get(
    import.meta.env.BASE_URL + "api/" + resource + ".json",
    {
      signal,
      timeout: 15000,
      headers: { Accept: "application/json" },
    },
  );
  validateResponse(resource, data);
  return data;
}
export function validateResponse(resource, data) {
  const seller = (value) =>
    value && Number.isFinite(value.id) && typeof value.name === "string";
  const item = (value) =>
    value &&
    Number.isFinite(value.id) &&
    typeof value.title === "string" &&
    Number.isFinite(value.price) &&
    Number.isFinite(value.stock) &&
    seller(value.seller) &&
    seller(value.creator);
  let valid = false;
  if (resource.startsWith("item-details/")) valid = item(data);
  else if (resource.startsWith("author/"))
    valid =
      seller(data) &&
      Array.isArray(data.items) &&
      data.items.every(item) &&
      Array.isArray(data.createdItems) &&
      data.createdItems.every(item);
  else if (resource === "top-sellers")
    valid = Array.isArray(data) && data.every(seller);
  else if (resource === "hot-collections")
    valid =
      Array.isArray(data) &&
      data.every(
        (c) =>
          typeof c.id === "string" &&
          typeof c.name === "string" &&
          item(c.featured) &&
          Array.isArray(c.items),
      );
  else if (resource.startsWith("collection/"))
    valid = data && item(data.featured) && Array.isArray(data.items);
  else valid = Array.isArray(data) && data.every(item);
  if (!valid) throw new Error("The shop returned an invalid response.");
}
export function remainingTime(expiresAt, now = Date.now()) {
  if (!expiresAt || !Number.isFinite(Number(expiresAt))) return null;
  const seconds = Math.max(0, Math.floor((Number(expiresAt) - now) / 1000));
  return {
    expired: seconds === 0,
    hours: Math.floor(seconds / 3600),
    minutes: Math.floor(seconds / 60) % 60,
    seconds: seconds % 60,
  };
}
export function visibleItems(
  items,
  query = "",
  category = "all",
  inStock = false,
) {
  const term = query.trim().toLowerCase();
  return items.filter(
    (item) =>
      (category === "all" || item.category === category) &&
      (!inStock || item.stock > 0) &&
      (!term ||
        (item.title + " " + item.categoryName + " " + item.seller.name)
          .toLowerCase()
          .includes(term)),
  );
}
