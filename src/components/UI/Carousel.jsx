import Slider from "react-slick";
import { useEffect, useState } from "react";
import { slidesForWidth } from "../../carousel";
import "slick-carousel/slick/slick.css";
function Arrow({ onClick, direction, label }) {
  return (
    <button
      type="button"
      className={"nft-carousel-arrow " + direction}
      onClick={onClick}
      aria-label={(direction === "prev" ? "Previous " : "Next ") + label}
    >
      <i
        aria-hidden="true"
        className={"fa fa-chevron-" + (direction === "prev" ? "left" : "right")}
      />
    </button>
  );
}
export default function Carousel({ children, label }) {
  const [slides, setSlides] = useState(() => slidesForWidth(window.innerWidth));
  useEffect(() => {
    const resize = () => setSlides(slidesForWidth(window.innerWidth));
    window.addEventListener("resize", resize);
    resize();
    return () => window.removeEventListener("resize", resize);
  }, []);
  return (
    <div className="nft-carousel" aria-label={label}>
      <Slider
        infinite
        slidesToShow={slides}
        slidesToScroll={1}
        speed={400}
        prevArrow={<Arrow direction="prev" label={label} />}
        nextArrow={<Arrow direction="next" label={label} />}
      >
        {children}
      </Slider>
    </div>
  );
}
