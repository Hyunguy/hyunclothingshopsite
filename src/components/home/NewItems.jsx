import useResource from '../../useResource';
import Carousel from '../UI/Carousel';
import NftCard, {NftCardSkeleton} from '../UI/NftCard';
import LoadError from '../UI/LoadError';
export default function NewItems() {
 const {data,error,retry} = useResource('/newItems');
 return <section id="section-items" className="no-bottom"><div className="container"><div className="row"><div className="col-lg-12"><div className="text-center"><h2>New Items</h2><div className="small-border bg-color-2"/></div></div></div>
 {error ? <LoadError retry={retry}/> : data ? <Carousel label="new items">{data.map(item => <div key={item.id}><NftCard item={item}/></div>)}</Carousel> : <div className="row" role="status" aria-label="Loading new items">{Array.from({length:4},(_,i)=><div className="col-lg-3 col-md-6" key={i}><NftCardSkeleton/></div>)}</div>}
 </div></section>;
}
