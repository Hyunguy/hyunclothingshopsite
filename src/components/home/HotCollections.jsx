import {Link} from 'react-router-dom';
import useResource from '../../useResource';
import Carousel from '../UI/Carousel';
import Skeleton from '../UI/Skeleton';
import LoadError from '../UI/LoadError';
export default function HotCollections() {
  const {data, error, retry} = useResource('/hotCollections');
  return <section id="section-collections" className="no-bottom"><div className="container"><div className="row"><div className="col-lg-12"><div className="text-center"><h2>Hot Collections</h2><div className="small-border bg-color-2" /></div></div></div>
    {error ? <LoadError retry={retry}/> : data ? <Carousel label="collections">{data.map(item => <div key={item.id}><div className="nft_coll">
      <div className="nft_wrap"><Link to={'/item-details/' + item.nftId}><img src={item.nftImage} className="lazy img-fluid" alt={item.title}/></Link></div>
      <div className="nft_coll_pp"><Link to={'/author/' + item.authorId} aria-label={'View author of ' + item.title}><img className="lazy pp-coll" src={item.authorImage} alt=""/></Link><i className="fa fa-check"/></div>
      <div className="nft_coll_info"><Link to="/explore"><h4>{item.title}</h4></Link><span>ERC-{item.code}</span></div>
    </div></div>)}</Carousel> : <div className="row" role="status" aria-label="Loading collections">{Array.from({length: 4}, (_, i) => <div className="col-lg-3 col-md-6" key={i}><div className="nft_coll"><Skeleton width="100%" height={200}/><Skeleton width={60} height={60} borderRadius="50%"/><div><Skeleton width="65%" height={22}/></div><Skeleton width="35%" height={18}/></div></div>)}</div>}
  </div></section>;
}
