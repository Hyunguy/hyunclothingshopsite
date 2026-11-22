import { Link } from "react-router-dom";
import { useResource } from "../useResource";
import { money } from "../catalog";
import { ProductImage } from "../components";
import {
  Carousel,
  ItemCard,
  SellerLink,
  Skeletons,
  Failure,
} from "../ui/MarketplaceUI";

function Collections() {
  const state = useResource("hot-collections");
  if (state.error) return <Failure {...state} />;
  if (state.loading)
    return (
      <section className="market-section">
        <h2>Collections</h2>
        <Skeletons />
      </section>
    );
  return (
    <Carousel title="Collections" viewAll="/explore">
      {state.data.map((collection) => (
        <div key={collection.id} className="carousel-cell collection-card">
          <Link
            to={"/item-details/" + collection.featured.id}
            className="collection-image"
            aria-label={"View " + collection.featured.title}
          >
            <ProductImage product={collection.featured} loading="lazy" />
          </Link>
          <div className="collection-caption">
            <Link to={"/collection/" + collection.id}>{collection.name}</Link>
            <span>{collection.items.length} items</span>
          </div>
          <SellerLink seller={collection.featured.seller} />
        </div>
      ))}
    </Carousel>
  );
}
function NewItems({ saved, toggleSave }) {
  const state = useResource("new-items");
  if (state.error) return <Failure {...state} />;
  if (state.loading)
    return (
      <section className="market-section">
        <h2>New arrivals</h2>
        <Skeletons />
      </section>
    );
  return (
    <Carousel title="New arrivals" viewAll="/explore">
      {state.data.map((item) => (
        <div className="carousel-cell" key={item.id}>
          <ItemCard item={item} saved={saved} toggleSave={toggleSave} />
        </div>
      ))}
    </Carousel>
  );
}
function TopSellers() {
  const state = useResource("top-sellers");
  return (
    <section className="market-section" data-aos="fade-up">
      <div className="section-heading">
        <h2>Top sellers</h2>
        <span className="muted small">Sample seller profiles</span>
      </div>
      {state.error ? (
        <Failure {...state} />
      ) : state.loading ? (
        <Skeletons count={12} type="sellers" />
      ) : (
        <ol className="seller-grid">
          {state.data.map((seller, index) => (
            <li key={seller.id}>
              <span className="seller-rank">{index + 1}</span>
              <Link to={"/author/" + seller.id} className="ranked-seller">
                <img src={seller.image} alt="" loading="lazy" />
                <div>
                  <h3>{seller.name}</h3>
                  <p>{money(seller.sales)} sales</p>
                </div>
              </Link>
            </li>
          ))}
        </ol>
      )}
    </section>
  );
}
export default function Home(props) {
  return (
    <>
      <div className="page-heading">
        <h1>Shop</h1>
        <Link to="/explore">Browse all clothing →</Link>
      </div>
      <Collections />
      <NewItems {...props} />
      <TopSellers />
    </>
  );
}
