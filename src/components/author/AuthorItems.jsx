import NftCard, { NftCardSkeleton } from "../UI/NftCard";
export default function AuthorItems({ author }) {
  return (
    <div className="de_tab_content">
      <div className="tab-1">
        <div className="row">
          {author
            ? author.nftCollection.map((item) => (
                <div
                  className="col-lg-3 col-md-6 col-sm-6 col-xs-12"
                  key={item.id}
                >
                  <NftCard item={item} author={author} />
                </div>
              ))
            : Array.from({ length: 8 }, (_, i) => (
                <div className="col-lg-3 col-md-6 col-sm-6 col-xs-12" key={i}>
                  <NftCardSkeleton />
                </div>
              ))}
        </div>
      </div>
    </div>
  );
}
