export function remainingTime(expiryDate, now = Date.now()) {
  if (!Number.isFinite(expiryDate)) return null;
  const seconds = Math.max(0, Math.floor((expiryDate - now) / 1000));
  return {
    hours: Math.floor(seconds / 3600),
    minutes: Math.floor(seconds / 60) % 60,
    seconds: seconds % 60,
  };
}
