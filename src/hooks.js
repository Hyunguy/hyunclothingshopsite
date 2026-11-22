import { useEffect, useState } from "react";
export function usePersistentState(key, initial) {
  const [value, setValue] = useState(() => {
    try {
      const v = JSON.parse(localStorage.getItem(key));
      return Array.isArray(v)
        ? v.filter((item) =>
            key.includes("bag")
              ? item &&
                Number.isFinite(item.id) &&
                Number.isFinite(item.price) &&
                Number.isInteger(item.quantity) &&
                item.quantity > 0 &&
                Number.isFinite(item.stock)
              : Number.isFinite(item),
          )
        : initial;
    } catch {
      return initial;
    }
  });
  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {}
  }, [key, value]);
  return [value, setValue];
}
