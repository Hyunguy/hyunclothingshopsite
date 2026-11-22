import { useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { useResource } from "../useResource";
import { SORT_OPTIONS, visibleItems } from "../marketplace";
import { Search } from "lucide-react";
import { ItemCard, Skeletons, Failure, Empty } from "../ui/MarketplaceUI";

export default function Explore({ saved, toggleSave, savedOnly = false }) {
  const { id: collectionId } = useParams();
  const [params, setParams] = useSearchParams();
  const sort = SORT_OPTIONS.some(([value]) => value === params.get("sort"))
    ? params.get("sort")
    : "default";
  const query = params.get("q") || "";
  const category = collectionId || params.get("category") || "all";
  const inStock = params.get("stock") === "true";
  const state = useResource("explore/" + sort);
  const collections = useResource("hot-collections");
  const [page, setPage] = useState({ key: "", limit: 8 });
  const key = [sort, query, category, savedOnly, inStock].join("|");
  const limit = page.key === key ? page.limit : 8;
  const setFilter = (name, value) => {
    setParams(
      (previous) => {
        const next = new URLSearchParams(previous);
        value ? next.set(name, value) : next.delete(name);
        return next;
      },
      { replace: true },
    );
  };
  if (state.error) return <Failure {...state} />;
  let filtered = visibleItems(state.data || [], query, category, inStock);
  if (savedOnly) filtered = filtered.filter((item) => saved.includes(item.id));
  const heading = savedOnly
    ? "Saved items"
    : collectionId
      ? collections.data?.find((c) => c.id === collectionId)?.name ||
        "Collection"
      : "All clothing";
  return (
    <>
      <div className="page-heading">
        <h1>{heading}</h1>
        <span className="muted small">Clothing / Explore</span>
      </div>
      <div className="explore-controls">
        <label className="search">
          <Search size={16} />
          <input
            aria-label="Search clothing"
            placeholder="Search clothing or sellers"
            value={query}
            onChange={(e) => setFilter("q", e.target.value)}
          />
        </label>
        {!collectionId && (
          <label>
            Category
            <select
              aria-label="Category"
              value={category}
              onChange={(e) => setFilter("category", e.target.value)}
            >
              <option value="all">All categories</option>
              {collections.data?.map((c) => (
                <option value={c.id} key={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </label>
        )}
        <label>
          Sort
          <select
            aria-label="Sort products"
            value={sort}
            onChange={(e) => setFilter("sort", e.target.value)}
          >
            {SORT_OPTIONS.map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </label>
        <label className="stock-check">
          <input
            type="checkbox"
            checked={inStock}
            onChange={(e) => setFilter("stock", e.target.checked ? "true" : "")}
          />
          In stock
        </label>
      </div>
      <div className="results-bar">
        <span aria-live="polite">
          {state.loading ? "Loading items…" : filtered.length + " items"}
        </span>
        {(query || (!collectionId && category !== "all") || inStock) && (
          <button onClick={() => setParams({})}>Clear filters</button>
        )}
      </div>
      {state.loading ? (
        <Skeletons count={8} />
      ) : filtered.length ? (
        <>
          <div
            className="product-grid explore-grid"
            data-aos="fade-in"
            key={key}
          >
            {filtered.slice(0, limit).map((item) => (
              <ItemCard
                key={item.id}
                item={item}
                saved={saved}
                toggleSave={toggleSave}
              />
            ))}
          </div>
          <div className="load-more">
            <p aria-live="polite">
              Showing {Math.min(limit, filtered.length)} of {filtered.length}
            </p>
            {limit < filtered.length && (
              <button
                className="secondary"
                onClick={() => setPage({ key, limit: limit + 4 })}
              >
                Load more
              </button>
            )}
          </div>
        </>
      ) : (
        <Empty
          title={savedOnly ? "No saved items" : "No matching items"}
          text={
            savedOnly ? "Use the heart on an item to save it here." : undefined
          }
        />
      )}
    </>
  );
}
