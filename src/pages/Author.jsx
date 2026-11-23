import { useState } from "react";
import { useParams } from "react-router-dom";
import AuthorBanner from "../images/author_banner.jpg";
import AuthorItems from "../components/author/AuthorItems";
import Skeleton from "../components/UI/Skeleton";
import LoadError from "../components/UI/LoadError";
import useResource from "../useResource";
import { resourcePath } from "../api";
function Profile({ author }) {
  const [following, setFollowing] = useState(false);
  const [copied, setCopied] = useState(false);
  async function copy() {
    try {
      await navigator.clipboard.writeText(author.address);
      setCopied(true);
    } catch {
      setCopied(false);
    }
  }
  return (
    <>
      <div className="col-md-12">
        <div className="d_profile de-flex">
          <div className="de-flex-col">
            <div className="profile_avatar">
              <img src={author.authorImage} alt={author.authorName} />
              <i className="fa fa-check" />
              <div className="profile_name">
                <h4>
                  {author.authorName}
                  <span className="profile_username">@{author.tag}</span>
                  <span id="wallet" className="profile_wallet">
                    {author.address}
                  </span>
                  <button
                    id="btn_copy"
                    title="Copy wallet address"
                    onClick={copy}
                  >
                    {copied ? "Copied" : "Copy"}
                  </button>
                </h4>
              </div>
            </div>
          </div>
          <div className="profile_follow de-flex">
            <div className="de-flex-col">
              <div className="profile_follower">
                {author.followers + (following ? 1 : 0)} followers
              </div>
              <button
                className="btn-main"
                aria-pressed={following}
                onClick={() => setFollowing((value) => !value)}
              >
                {following ? "Unfollow" : "Follow"}
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="col-md-12">
        <div className="de_tab tab_simple">
          <AuthorItems author={author} />
        </div>
      </div>
    </>
  );
}
export default function Author() {
  const { id } = useParams();
  const valid = /^\d+$/.test(id || "");
  return valid ? (
    <AuthorResource id={id} />
  ) : (
    <div className="container route-error">
      <h2>Author not found</h2>
    </div>
  );
}
function AuthorResource({ id }) {
  const { data, error, retry } = useResource(resourcePath("authors", id));
  return (
    <div id="wrapper">
      <div className="no-bottom no-top" id="content">
        <div id="top" />
        <section
          id="profile_banner"
          aria-label="Author banner"
          className="text-light"
          style={{ background: "url(" + AuthorBanner + ") top" }}
        />
        <section aria-label="Author profile">
          <div className="container">
            <div className="row">
              {error ? (
                <LoadError retry={retry} />
              ) : data ? (
                <Profile key={id} author={data} />
              ) : (
                <>
                  <div
                    className="col-md-12 profile-loading"
                    role="status"
                    aria-label="Loading author"
                  >
                    <Skeleton width={150} height={150} borderRadius="50%" />
                    <div>
                      <Skeleton width={200} height={28} />
                      <br />
                      <Skeleton width={120} height={18} />
                      <br />
                      <Skeleton width={280} height={18} />
                    </div>
                  </div>
                  <AuthorItems />
                </>
              )}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
