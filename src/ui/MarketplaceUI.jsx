import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import Slider from "react-slick";
import { ArrowLeft, ArrowRight, Heart, Clock } from "lucide-react";
import { remainingTime } from "../marketplace";
import { money } from "../catalog";
import { ProductImage } from "../components";
import "slick-carousel/slick/slick.css";

export function Countdown({ expiresAt }) {
  const [now, setNow] = useState(Date.now);
  useEffect(() => {
    if (!expiresAt || Number(expiresAt) <= Date.now()) return;
    const timer = setInterval(() => {
      setNow(Date.now());
      if (Date.now() >= Number(expiresAt)) clearInterval(timer);
    }, 1000);
    return () => clearInterval(timer);
  }, [expiresAt]);
  const time = remainingTime(expiresAt, now);
  if (!time) return null;
  return (
    <span className="countdown" title="Sample listing deadline">
      <Clock size={12} />
      {time.expired
        ? "Listing ended"
        : time.hours +
          "h " +
          String(time.minutes).padStart(2, "0") +
          "m " +
          String(time.seconds).padStart(2, "0") +
          "s"}
    </span>
  );
}
export function SellerLink({ seller }) {
  return (
    <Link className="seller-link" to={"/author/" + seller.id}>
      <img src={seller.image} alt="" loading="lazy" />
      <span>{seller.name}</span>
    </Link>
  );
}
export function ItemCard({ item, saved, toggleSave }) {
  const isSaved = saved.includes(item.id);
  return (
    <article className="product-card">
      <div className="product-image">
        <Link
          className="product-open"
          to={"/item-details/" + item.id}
          aria-label={"View " + item.title}
        >
          <ProductImage product={item} loading="lazy" />
          <span className="quick-view">
            View details <ArrowRight size={15} />
          </span>
        </Link>
        <button
          className={"icon-button save-button " + (isSaved ? "is-saved" : "")}
          aria-label={(isSaved ? "Unsave " : "Save ") + item.title}
          aria-pressed={isSaved}
          onClick={() => toggleSave(item.id)}
        >
          <Heart size={18} fill={isSaved ? "currentColor" : "none"} />
        </button>
        <Countdown expiresAt={item.expiresAt} />
      </div>
      <div className="product-title">
        <Link to={"/item-details/" + item.id}>{item.title}</Link>
        <div className="price-line">
          <span>{money(item.price)}</span>
          <span className="like-count" title="Sample likes">
            <Heart size={12} />
            {item.likes + Number(isSaved)}
          </span>
        </div>
      </div>
      <SellerLink seller={item.seller} />
    </article>
  );
}
export function Skeletons({ count = 4, type = "cards" }) {
  return (
    <div
      className={
        type === "sellers" ? "seller-grid" : "product-grid loading-grid"
      }
      aria-label="Loading items"
      aria-busy="true"
    >
      {Array.from({ length: count }, (_, i) => (
        <div
          className={
            "skeleton " + (type === "sellers" ? "seller-skeleton" : "")
          }
          key={i}
          aria-hidden="true"
        >
          <div />
          <p />
          <span />
        </div>
      ))}
    </div>
  );
}
export function Failure({ error, retry }) {
  return (
    <div className="notice" role="alert">
      <p>{error}</p>
      <button onClick={retry}>Try again</button>
      <Link to="/explore">Browse the shop</Link>
    </div>
  );
}
export function Carousel({ title, children, viewAll }) {
  const slider = useRef(null);
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const media = matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);
  return (
    <section className="market-section" aria-label={title} data-aos="fade-up">
      <div className="section-heading">
        <h2>{title}</h2>
        <div className="section-controls">
          {viewAll && <Link to={viewAll}>View all</Link>}
          <button
            aria-label={"Previous " + title.toLowerCase()}
            onClick={() => slider.current?.slickPrev()}
          >
            <ArrowLeft size={17} />
          </button>
          <button
            aria-label={"Next " + title.toLowerCase()}
            onClick={() => slider.current?.slickNext()}
          >
            <ArrowRight size={17} />
          </button>
        </div>
      </div>
      <Slider
        ref={slider}
        infinite
        slidesToShow={4}
        slidesToScroll={1}
        speed={reduced ? 0 : 300}
        arrows={false}
        accessibility
        swipeToSlide
        responsive={[
          { breakpoint: 1100, settings: { slidesToShow: 3 } },
          { breakpoint: 800, settings: { slidesToShow: 2 } },
          { breakpoint: 500, settings: { slidesToShow: 1 } },
        ]}
      >
        {children}
      </Slider>
    </section>
  );
}
export function Empty({
  title = "No matching items",
  text = "Try a different search or clear your filters.",
}) {
  return (
    <div className="empty">
      <h2>{title}</h2>
      <p>{text}</p>
      <Link className="secondary" to="/explore">
        Browse all clothing
      </Link>
    </div>
  );
}
