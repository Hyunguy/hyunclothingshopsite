import { useEffect, useRef, useState } from "react";
import { Heart, X, ArrowUpRight, Plus, Minus, ShoppingBag } from "lucide-react";
import { money } from "./catalog";

export function ProductImage({ product, index = 0, ...props }) {
  const [failed, setFailed] = useState(false);
  return failed ? (
    <div className="image-fallback">Image unavailable</div>
  ) : (
    <img
      src={product.images?.[index] || product.thumbnail}
      alt={product.title}
      onError={() => setFailed(true)}
      {...props}
    />
  );
}
export function Modal({ title, close, children, wide = false }) {
  const ref = useRef(null);
  useEffect(() => {
    const previous = document.activeElement;
    ref.current.showModal();
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = overflow;
      previous?.focus();
    };
  }, []);
  return (
    <dialog
      ref={ref}
      className={wide ? "modal wide" : "modal"}
      onCancel={(e) => {
        e.preventDefault();
        close();
      }}
      onClick={(e) => {
        if (e.target === ref.current) close();
      }}
      aria-label={title}
    >
      <div className="modal-heading">
        <span className="eyebrow">{title}</span>
        <button
          className="icon-button"
          aria-label="Close dialog"
          onClick={close}
        >
          <X size={21} />
        </button>
      </div>
      {children}
    </dialog>
  );
}
export function ProductDetail({ product, add, saved, save }) {
  const [index, setIndex] = useState(0);
  return (
    <div className="product-detail">
      <div>
        <div className="detail-image">
          <ProductImage key={index} product={product} index={index} />
        </div>
        {product.images?.length > 1 && (
          <div className="thumbnails">
            {product.images.map((src, i) => (
              <button
                key={src}
                className={index === i ? "selected" : ""}
                onClick={() => setIndex(i)}
                aria-label={"View image " + (i + 1)}
              >
                <img src={src} alt="" />
              </button>
            ))}
          </div>
        )}
      </div>
      <div className="detail-copy">
        <p className="eyebrow">{product.categoryName || product.category}</p>
        <h1>{product.title}</h1>
        <p className="detail-price">{money(product.price)}</p>
        <p>{product.description}</p>
        <p className="stock">
          {product.stock > 0 ? product.stock + " available" : "Out of stock"}
        </p>
        <button
          className="primary"
          disabled={!product.stock}
          onClick={() => add(product)}
        >
          Add to bag <Plus size={17} />
        </button>
        <button className="secondary" onClick={save}>
          <Heart size={16} fill={saved ? "currentColor" : "none"} />
          {saved ? "Saved" : "Save for later"}
        </button>
        <div className="detail-facts">
          <div>
            <span>Delivery</span>
            <span>{product.shippingInformation || "Not specified"}</span>
          </div>
          <div>
            <span>Returns</span>
            <span>{product.returnPolicy || "Not specified"}</span>
          </div>
          <div>
            <span>Product code</span>
            <span>{product.sku}</span>
          </div>
        </div>
        <p className="small muted">Demo item. Size options are unavailable.</p>
      </div>
    </div>
  );
}
export function Bag({ bag, change, close }) {
  const [review, setReview] = useState(false);
  const total =
    bag.reduce((sum, p) => sum + Math.round(p.price * 100) * p.quantity, 0) /
    100;
  if (!bag.length)
    return (
      <div className="empty">
        <ShoppingBag size={32} strokeWidth={1} />
        <h2>Your bag is empty</h2>
        <p>Browse the shop to add an item.</p>
        <button className="primary" onClick={close}>
          Continue shopping <ArrowUpRight size={17} />
        </button>
      </div>
    );
  return (
    <>
      <div className="bag-items">
        {bag.map((p) => (
          <div className="bag-item" key={p.id}>
            <img src={p.thumbnail} alt={p.title} />
            <div>
              <h3>{p.title}</h3>
              <p>{money(p.price)}</p>
              <div className="quantity">
                <button
                  aria-label={"Decrease " + p.title}
                  onClick={() => change(p, -1)}
                >
                  <Minus size={13} />
                </button>
                <span>{p.quantity}</span>
                <button
                  aria-label={"Increase " + p.title}
                  disabled={p.quantity >= p.stock}
                  onClick={() => change(p, 1)}
                >
                  <Plus size={13} />
                </button>
                <button
                  className="remove"
                  onClick={() => change(p, -p.quantity)}
                >
                  Remove
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="subtotal">
        <span>Subtotal</span>
        <strong>{money(total)}</strong>
      </div>
      <p className="small muted">Demo bag · No payment will be taken.</p>
      <button className="primary" onClick={() => setReview(true)}>
        Review bag <ArrowUpRight size={17} />
      </button>
      {review && (
        <div className="notice" role="status">
          Your selection is saved on this device. Checkout is not available in
          this demo; no order has been placed.
        </div>
      )}
    </>
  );
}
