export const money = (value) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(
    value,
  );
export function changeBag(bag, product, delta) {
  const existing = bag.find((p) => p.id === product.id);
  const quantity = Math.max(
    0,
    Math.min(product.stock || 0, (existing?.quantity || 0) + delta),
  );
  return quantity === 0
    ? bag.filter((p) => p.id !== product.id)
    : existing
      ? bag.map((p) => (p.id === product.id ? { ...p, quantity } : p))
      : [...bag, { ...product, quantity }];
}
