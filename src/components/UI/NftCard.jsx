import { Link } from "react-router-dom";
import Countdown from "./Countdown";
import Skeleton from "./Skeleton";
export function NftCardSkeleton() {
  return (
    <div className="nft__item" aria-label="Loading NFT">
      <Skeleton width={50} height={50} borderRadius="50%" />
      <div className="nft__item_wrap">
        <Skeleton width="100%" height="80%" borderRadius={8} />
      </div>
      <Skeleton width="70%" height={20} />
      <br />
      <Skeleton width="40%" height={16} />
    </div>
  );
}
export default function NftCard({ item, author }) {
  const authorId = item.authorId ?? author?.authorId;
  const authorImage = item.authorImage ?? author?.authorImage;
  return (
    <div className="nft__item" data-aos="fade-in">
      <div className="author_list_pp">
        <Link
          to={"/author/" + authorId}
          title={
            author?.authorName ? "Creator: " + author.authorName : "View author"
          }
        >
          <img
            className="lazy"
            src={authorImage}
            alt={author?.authorName || "NFT author"}
          />
          <i className="fa fa-check" />
        </Link>
      </div>
      <Countdown expiryDate={item.expiryDate} />
      <div className="nft__item_wrap">
        <Link to={"/item-details/" + item.nftId}>
          <img
            src={item.nftImage}
            className="lazy nft__item_preview"
            alt={item.title}
          />
        </Link>
      </div>
      <div className="nft__item_info">
        <Link to={"/item-details/" + item.nftId}>
          <h4>{item.title}</h4>
        </Link>
        <div className="nft__item_price">{item.price} ETH</div>
        <div className="nft__item_like">
          <i className="fa fa-heart" aria-hidden="true" />
          <span>{item.likes}</span>
        </div>
      </div>
    </div>
  );
}
