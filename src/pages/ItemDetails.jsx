import { useParams, Link } from "react-router-dom";
import { Heart, Eye } from "lucide-react";
import { useResource } from "../useResource";
import { ProductDetail } from "../components";
import { Countdown, SellerLink, Skeletons, Failure } from "../ui/MarketplaceUI";

export default function ItemDetails({ saved, toggleSave, add }) {
  const { id } = useParams();
  const state = useResource("item-details/" + id);
  if (state.error) return <Failure {...state} />;
  if (state.loading)
    return (
      <>
        <div className="page-heading">
          <h1>Product details</h1>
        </div>
        <Skeletons count={2} />
      </>
    );
  const item = state.data;
  return (
    <>
      <div className="detail-breadcrumb">
        <Link to="/explore">All clothing</Link>
        <span>/</span>
        <Link to={"/collection/" + item.category}>{item.categoryName}</Link>
      </div>
      <section className="item-page" data-aos="fade-in">
        <ProductDetail
          key={item.id}
          product={item}
          add={add}
          saved={saved.includes(item.id)}
          save={() => toggleSave(item.id)}
        />
        <div className="item-metadata">
          <div className="item-people">
            <div>
              <h3>Seller</h3>
              <SellerLink seller={item.seller} />
            </div>
            <div>
              <h3>Creator</h3>
              <SellerLink seller={item.creator} />
            </div>
          </div>
          <div className="item-stats">
            <span>
              <Eye size={15} />
              {item.views} views
            </span>
            <span>
              <Heart size={15} />
              {item.likes + Number(saved.includes(item.id))} likes
            </span>
            <Countdown expiresAt={item.expiresAt} />
          </div>
          <p className="sample-note">
            Sample marketplace activity. No purchases or bids are processed.
          </p>
        </div>
      </section>
    </>
  );
}
