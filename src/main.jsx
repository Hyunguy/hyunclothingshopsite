import React, { useState } from 'react';
import { createRoot } from 'react-dom/client';
import { Search, ArrowUpRight, Heart, ShoppingBag, X, SlidersHorizontal, ArrowRight } from 'lucide-react';
import { categories, filterProducts, changeBag } from './catalog';
import { useCatalog, usePersistentState } from './hooks';
import { ProductCard, Modal, ProductDetail, Bag } from './components';
import './styles.css';

function App() {
  const catalog = useCatalog();
  const [category,setCategory] = useState('all');
  const [query,setQuery] = useState('');
  const [sort,setSort] = useState('featured');
  const [savedOnly,setSavedOnly] = useState(false);
  const [inStock,setInStock] = useState(false);
  const [saved,setSaved] = usePersistentState('eventide-saved-v1',[]);
  const [bag,setBag] = usePersistentState('eventide-bag-v1',[]);
  const [modal,setModal] = useState(null);
  const [toast,setToast] = useState('');
  const products = filterProducts(catalog.products,{ category,query,sort,savedOnly,saved,inStock });
  const count = bag.reduce((sum,p) => sum + p.quantity,0);
  function toggleSave(id) { setSaved(list => list.includes(id) ? list.filter(x => x !== id) : [...list,id]); }
  function reset() { setCategory('all'); setQuery(''); setSavedOnly(false); setInStock(false); }
  function shop() { reset(); window.scrollTo({ top:0, behavior:'smooth' }); }
  function add(product) { setBag(list => changeBag(list,product,1)); setModal({type:'bag'}); setToast('Your bag is saved on this device.'); }
  return <>
    <div className="announcement"><span>Considered pieces. Everyday possibilities.</span><span className="demo-note">An independent collection · Demo store</span></div>
    <header><nav aria-label="Main navigation"><button className="nav-active" onClick={shop}>Shop</button><button onClick={() => setModal({type:'journal'})}>Journal</button><button onClick={() => setModal({type:'about'})}>Our story</button></nav>
      <button className="wordmark" onClick={shop} aria-label="Eventide home"><span className="brand-symbol">◒</span> EVENTIDE</button>
      <div className="header-actions"><button aria-label="Saved pieces" onClick={() => {setSavedOnly(!savedOnly);setCategory('all');setQuery('');}} aria-pressed={savedOnly}><Heart size={17}/><span>Saved</span><small>{saved.length}</small></button><button onClick={() => setModal({type:'bag'})}><ShoppingBag size={17}/><span>Bag</span><small>{count}</small></button></div>
    </header>
    <main id="collection">
      <div className="breadcrumb">EVENTIDE <span>/</span> THE COLLECTION</div>
      <section className="collection-heading"><div><p className="eyebrow">THE EVERYDAY EDIT</p><h1>{savedOnly ? 'Your saved edit' : 'The collection'}<span> / {String(products.length).padStart(2,'0')}</span></h1></div><p>A wardrobe, thoughtfully assembled.<br/>Find your everyday favourites.</p></section>
      <div className="catalog-layout"><aside><p className="eyebrow">EXPLORE</p><div className="category-nav">{categories.map(c => <button className={category === c.id && !savedOnly ? 'active' : ''} key={c.id} onClick={() => {setCategory(c.id);setSavedOnly(false);}}>{c.name}<span>{catalog.products.filter(p => c.id === 'all' || p.category === c.id).length.toString().padStart(2,'0')}</span></button>)}</div>
        <div className="aside-filter"><p className="eyebrow">REFINE YOUR EDIT</p><label><input type="checkbox" checked={inStock} onChange={e => setInStock(e.target.checked)}/> In stock only</label><button className={savedOnly ? 'text-button active' : 'text-button'} onClick={() => setSavedOnly(!savedOnly)}><Heart size={14}/> Saved pieces <span>{saved.length}</span></button></div>
        <div className="aside-note"><span className="little-mark">◒</span><p>Less, but better.</p><span>Pieces to reach for.<br/>Room to make them yours.</span><button onClick={() => setModal({type:'about'})}>Discover Eventide <ArrowUpRight size={14}/></button></div></aside>
        <section className="catalog" aria-label="Product collection"><div className="toolbar"><span className="result-count" aria-live="polite">{catalog.loading ? 'Loading collection…' : products.length + ' pieces'}</span><div className="tools"><label className="search"><Search size={16}/><input aria-label="Search products" placeholder="Find a piece" value={query} onChange={e => setQuery(e.target.value)}/>{query && <button aria-label="Clear search" onClick={() => setQuery('')}><X size={14}/></button>}</label><label className="sort"><SlidersHorizontal size={15}/><select aria-label="Sort products" value={sort} onChange={e => setSort(e.target.value)}><option value="featured">Featured</option><option value="newest">Newest</option><option value="low">Price: low to high</option><option value="high">Price: high to low</option><option value="name">Name: A–Z</option></select></label></div></div>
        {catalog.failed > 0 && !catalog.loading && <div className="notice" role="alert">{catalog.products.length ? 'Part of the collection is unavailable.' : 'We couldn’t load the collection. Please try again.'}<button onClick={catalog.retry}>Retry</button></div>}
        {(query || savedOnly || inStock) && <div className="active-filters"><span>{savedOnly ? 'Saved pieces' : query ? 'Results for “' + query + '”' : 'In stock'}{inStock && (query || savedOnly) ? ' · In stock' : ''}</span><button onClick={reset}>Clear filters <X size={12}/></button></div>}
        <div className="product-grid">{catalog.loading ? Array.from({length:6},(_,i) => <div key={i} className="skeleton" aria-hidden="true"><div/><p/><span/></div>) : products.map((product,index) => <ProductCard key={product.id} product={product} index={index} saved={saved.includes(product.id)} onSave={() => toggleSave(product.id)} onOpen={() => setModal({type:'product',product})}/>)}</div>
        {!catalog.loading && !products.length && catalog.failed < 3 && <div className="empty"><Search size={28} strokeWidth={1}/><h2>{savedOnly ? 'Make an edit of your own.' : 'Nothing here just yet.'}</h2><p>{savedOnly ? 'Tap the heart on a piece to keep it here.' : 'Try another search or clear your filters.'}</p><button className="secondary" onClick={reset}>View all clothing <ArrowRight size={16}/></button></div>}
        {!catalog.loading && products.length > 0 && <div className="collection-end"><span>YOU’VE SEEN ALL {products.length} PIECES</span><span>A considered edit. Nothing more.</span></div>}</section>
      </div>
      <section className="service-strip"><div><span>01</span><p>Find your everyday<br/><strong>A small, considered collection.</strong></p></div><div><span>02</span><p>Make it your own<br/><strong>Save the pieces you come back to.</strong></p></div><button onClick={() => setModal({type:'help'})}><span>03</span><p>A little guidance<br/><strong>Delivery & collection notes <ArrowUpRight size={14}/></strong></p></button></section>
    </main>
    <footer><div><button className="footer-wordmark" onClick={shop}>EVENTIDE</button><p>For the everyday, and the days between.</p></div><div className="footer-links"><button onClick={() => setModal({type:'about'})}>Our story</button><button onClick={() => setModal({type:'help'})}>Delivery & returns</button><button onClick={() => setModal({type:'privacy'})}>Privacy</button></div><div className="footer-bottom"><span>© {new Date().getFullYear()} Eventide</span><span>USD $ · English</span><span>Thoughtfully assembled.</span></div></footer>
    {toast && <div className="toast" role="status">{toast}<button className="icon-button" aria-label="Dismiss notification" onClick={() => setToast('')}><X size={16}/></button></div>}
    {modal && <Modal key={modal.type} title={modal.type === 'product' ? 'A closer look' : modal.type === 'bag' ? 'Your bag · ' + count : modal.type === 'journal' ? 'The journal' : modal.type === 'about' ? 'Our story' : modal.type === 'privacy' ? 'Privacy' : 'A little guidance'} close={() => setModal(null)} wide={modal.type === 'product'}>
      {modal.type === 'product' ? <ProductDetail product={modal.product} add={add} saved={saved.includes(modal.product.id)} save={() => toggleSave(modal.product.id)}/> : modal.type === 'bag' ? <Bag bag={bag} change={(p,d) => setBag(list => changeBag(list,p,d))} close={() => setModal(null)}/> :
      <div className="editorial">{modal.type === 'about' ? <><p className="eyebrow">THE EVENTIDE POINT OF VIEW</p><h2>For the days<br/>in between.</h2><p>A good wardrobe leaves room for living. Eventide is an exploration of everyday dressing: familiar silhouettes, a considered selection, and pieces you can make your own.</p><p>This is a demonstration storefront. The collection uses sample product data; products are not offered for sale.</p></> : modal.type === 'journal' ? <><p className="eyebrow">FIELD NOTES / 01</p><h2>The art of<br/>getting dressed.</h2><p>Start with the piece you reach for most. A shirt with the sleeves rolled back. A dress that needs very little else. Build around what already feels like you.</p><p>Try a simple edit: one familiar shape, one change of texture, and enough room to move. There’s no need to reinvent the everyday.</p><button className="primary" onClick={() => setModal(null)}>Explore the edit <ArrowUpRight size={16}/></button></> : modal.type === 'privacy' ? <><h2>A note on privacy.</h2><p>Your saved pieces and bag are stored in this browser on this device. No account or payment information is collected by this storefront.</p><p>Product information and images are requested from DummyJSON and its image provider. Those services receive standard network information when your browser connects.</p><button className="secondary" onClick={() => {setSaved([]);setBag([]);setToast('Your saved pieces and bag have been cleared.');setModal(null);}}>Clear my saved pieces and bag</button></> : <><h2>Good to know.</h2><p>This collection is a demo. There is no checkout, payment processing, or order fulfillment.</p><h3>Delivery & returns</h3><p>Each product’s details show the sample supplier’s delivery and return information. These are sample policies, not a promise of service.</p><h3>Sizing</h3><p>The source catalog does not provide size variants or measurements for choosing a garment size. We do not invent size availability.</p><h3>Your selection</h3><p>Your bag and saved pieces stay in this browser. You can change quantities or remove pieces at any time.</p></>}</div>}
    </Modal>}
  </>;
}
createRoot(document.getElementById('root')).render(<React.StrictMode><App/></React.StrictMode>);

