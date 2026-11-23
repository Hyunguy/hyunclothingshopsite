export function slidesForWidth(width) {
  if (width < 576) return 1;
  if (width < 992) return 2;
  if (width < 1200) return 3;
  return 4;
}
