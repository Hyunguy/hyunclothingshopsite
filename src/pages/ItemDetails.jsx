import { Link, useParams } from "react-router-dom";
import EthImage from "../images/ethereum.svg";
import Skeleton from "../components/UI/Skeleton";
import LoadError from "../components/UI/LoadError";
import useResource from "../useResource";
import { resourcePath } from "../api";
function Person({ name, id, image }) {
  return (
    <div className="item_author">
      <div className="author_list_pp">
        <Link to={"/author/" + id}>
          <img className="lazy" src={image} alt={name} />
          <i className="fa fa-check" />
        </Link>
      </div>
      <div className="author_list_info">
        <Link to={"/author/" + id}>{name}</Link>
      </div>
    </div>
  );
}
export default function ItemDetails() {
  const { id } = useParams();
  return /^\d+$/.test(id || "") ? (
    <ItemResource id={id} />
  ) : (
    <div className="container route-error">
      <h2>Item not found</h2>
      <Link to="/explore">Explore NFTs</Link>
    </div>
  );
}
function ItemResource({ id }) {
  const {
    data: item,
    error,
    retry,
  } = useResource(resourcePath("itemDetails", id));
  return (
    <div id="wrapper">
      <div className="no-bottom no-top" id="content">
        <div id="top" />
        <section aria-label="NFT details" className="mt90 sm-mt-0">
          <div className="container">
            <div className="row">
              {error ? (
                <LoadError retry={retry} />
              ) : (
                <>
                  <div className="col-md-6 text-center">
                    {item ? (
                      <img
                        src={item.nftImage}
                        className="img-fluid img-rounded mb-sm-30 nft-image"
                        alt={item.title}
                      />
                    ) : (
                      <Skeleton width="100%" height={520} borderRadius={8} />
                    )}
                  </div>
                  <div className="col-md-6">
                    <div className="item_info">
                      <h2>
                        {item ? (
                          item.title + " #" + item.tag
                        ) : (
                          <Skeleton width="80%" height={40} />
                        )}
                      </h2>
                      <div className="item_info_counts">
                        {item ? (
                          <>
                            <div className="item_info_views">
                              <i className="fa fa-eye" />
                              {item.views}
                            </div>
                            <div className="item_info_like">
                              <i className="fa fa-heart" />
                              {item.likes}
                            </div>
                          </>
                        ) : (
                          <Skeleton width={180} height={30} />
                        )}
                      </div>
                      {item ? (
                        <p>{item.description}</p>
                      ) : (
                        <p>
                          <Skeleton width="100%" height={20} />
                          <Skeleton width="100%" height={20} />
                          <Skeleton width="65%" height={20} />
                        </p>
                      )}
                      <div className="d-flex flex-row">
                        <div className="mr40">
                          <h6>Owner</h6>
                          {item ? (
                            <Person
                              name={item.ownerName}
                              id={item.ownerId}
                              image={item.ownerImage}
                            />
                          ) : (
                            <Skeleton width={200} height={50} />
                          )}
                        </div>
                        <div />
                      </div>
                      <div className="de_tab tab_simple">
                        <div className="de_tab_content">
                          <h6>Creator</h6>
                          {item ? (
                            <Person
                              name={item.creatorName}
                              id={item.creatorId}
                              image={item.creatorImage}
                            />
                          ) : (
                            <Skeleton width={200} height={50} />
                          )}
                        </div>
                        <div className="spacer-40" />
                        <h6>Price</h6>
                        <div className="nft-item-price">
                          <img src={EthImage} alt="ETH" />
                          {item ? (
                            <span>{item.price}</span>
                          ) : (
                            <Skeleton width={80} height={36} />
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
