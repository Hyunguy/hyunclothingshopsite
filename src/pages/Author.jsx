import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Copy } from "lucide-react";
import { useResource } from "../useResource";
import { ItemCard, Skeletons, Failure } from "../ui/MarketplaceUI";

export default function Author({ saved, toggleSave }) {
  const { id } = useParams();
  const state = useResource("author/" + id);
  const [following, setFollowing] = useState(false);
  const [copied, setCopied] = useState("");
  const [tab, setTab] = useState("items");
  useEffect(() => {
    setFollowing(false);
    setCopied("");
    setTab("items");
  }, [id]);
  if (state.error) return <Failure {...state} />;
  if (state.loading)
    return (
      <>
        <div className="profile-loading skeleton">
          <p />
          <span />
        </div>
        <Skeletons />
      </>
    );
  const seller = state.data;
  async function copyHandle() {
    try {
      await navigator.clipboard.writeText("@" + seller.handle);
      setCopied("Copied");
    } catch {
      setCopied("Copy unavailable. Select the handle to copy it.");
    }
  }
  return (
    <>
      <section className="seller-profile" data-aos="fade-in">
        <img src={seller.image} alt={seller.name} />
        <div>
          <span className="muted small">Seller profile</span>
          <h1>{seller.name}</h1>
          <div className="profile-handle">
            <span>@{seller.handle}</span>
            <button onClick={copyHandle} aria-label="Copy seller handle">
              <Copy size={14} />
            </button>
          </div>
          {copied && (
            <span role="status" className="small">
              {copied}
            </span>
          )}
          <p>{seller.description}</p>
        </div>
        <div className="follow-box">
          <p aria-live="polite">
            {seller.followers + Number(following)} followers
          </p>
          <button
            className="secondary"
            aria-pressed={following}
            onClick={() => setFollowing(!following)}
          >
            {following ? "Unfollow" : "Follow"}
          </button>
        </div>
      </section>
      <div
        className="profile-tabs"
        role="tablist"
        aria-label="Seller inventory"
      >
        <button
          id="listed-tab"
          role="tab"
          aria-selected={tab === "items"}
          aria-controls="seller-items"
          onClick={() => setTab("items")}
        >
          For sale ({seller.items.length})
        </button>
        <button
          id="created-tab"
          role="tab"
          aria-selected={tab === "createdItems"}
          aria-controls="seller-items"
          onClick={() => setTab("createdItems")}
        >
          Created ({seller.createdItems.length})
        </button>
      </div>
      <div
        id="seller-items"
        role="tabpanel"
        aria-labelledby={tab === "items" ? "listed-tab" : "created-tab"}
        className="product-grid explore-grid"
      >
        {seller[tab].map((item) => (
          <ItemCard
            key={item.id}
            item={item}
            saved={saved}
            toggleSave={toggleSave}
          />
        ))}
      </div>
      <p className="sample-note">
        Sample profile. Following changes this page only.
      </p>
    </>
  );
}
