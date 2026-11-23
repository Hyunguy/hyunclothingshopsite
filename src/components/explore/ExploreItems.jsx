import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { FILTERS, resourcePath } from "../../api";
import useResource from "../../useResource";
import NftCard, { NftCardSkeleton } from "../UI/NftCard";
import LoadError from "../UI/LoadError";
export default function ExploreItems() {
  const [params, setParams] = useSearchParams();
  const selected = params.get("filter") || "";
  const filter = FILTERS.includes(selected) ? selected : "";
  const search = params.get("search") || "";
  const [visible, setVisible] = useState(8);
  const { data, error, retry } = useResource(resourcePath("explore", filter));
  const items = data?.filter((item) =>
    item.title.toLowerCase().includes(search.toLowerCase()),
  );
  function changeFilter(event) {
    setVisible(8);
    const next = new URLSearchParams(params);
    if (event.target.value) next.set("filter", event.target.value);
    else next.delete("filter");
    setParams(next);
  }
  return (
    <>
      <div>
        <select
          id="filter-items"
          aria-label="Sort NFTs"
          value={filter}
          onChange={changeFilter}
        >
          <option value="">Default</option>
          <option value="price_low_to_high">Price, Low to High</option>
          <option value="price_high_to_low">Price, High to Low</option>
          <option value="likes_high_to_low">Most liked</option>
        </select>
      </div>
      {error ? (
        <LoadError retry={retry} />
      ) : items ? (
        items.slice(0, visible).map((item) => (
          <div
            key={item.id}
            className="d-item col-lg-3 col-md-6 col-sm-6 col-xs-12"
          >
            <NftCard item={item} />
          </div>
        ))
      ) : (
        Array.from({ length: 8 }, (_, i) => (
          <div key={i} className="col-lg-3 col-md-6 col-sm-6 col-xs-12">
            <NftCardSkeleton />
          </div>
        ))
      )}
      {items?.length === 0 && <p className="text-center">No NFTs found.</p>}
      {items && visible < items.length && (
        <div className="col-md-12 text-center">
          <button
            onClick={() => setVisible((n) => n + 4)}
            id="loadmore"
            className="btn-main lead"
          >
            Load more
          </button>
        </div>
      )}
    </>
  );
}
