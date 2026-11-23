import { useEffect, useState } from "react";
import { remainingTime } from "../../countdown";
export default function Countdown({ expiryDate }) {
  const [now, setNow] = useState(Date.now);
  useEffect(() => {
    if (!Number.isFinite(expiryDate)) return;
    const timer = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(timer);
  }, [expiryDate]);
  const time = remainingTime(expiryDate, now);
  if (!time) return null;
  return (
    <div className="de_countdown" aria-label="Time remaining">
      {time.hours}h {time.minutes}m {time.seconds}s
    </div>
  );
}
