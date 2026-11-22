import {Link} from 'react-router-dom';
import useResource from '../../useResource';
import Skeleton from '../UI/Skeleton';
import LoadError from '../UI/LoadError';
export default function TopSellers() {
 const {data,error,retry} = useResource('/topSellers');
 return <section id="section-popular" className="pb-5"><div className="container"><div className="row"><div className="col-lg-12"><div className="text-center"><h2>Top Sellers</h2><div className="small-border bg-color-2"/></div></div><div className="col-md-12">
 {error ? <LoadError retry={retry}/> : <ol className="author_list" aria-label={data ? 'Top sellers' : 'Loading sellers'}>{(data || Array.from({length:12},(_,id)=>({id}))).map(author=><li key={author.id}><div className="author_list_pp">{data ? <Link to={'/author/'+author.authorId}><img className="lazy pp-author" src={author.authorImage} alt={author.authorName}/><i className="fa fa-check"/></Link> : <Skeleton width={50} height={50} borderRadius="50%"/>}</div><div className="author_list_info">{data ? <><Link to={'/author/'+author.authorId}>{author.authorName}</Link><span>{author.price} ETH</span></> : <><Skeleton width={110} height={18}/><br/><Skeleton width={65} height={16}/></>}</div></li>)}</ol>}
 </div></div></div></section>;
}
