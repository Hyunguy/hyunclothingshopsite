export const categories = [
  { id: 'all', name: 'All clothing' },
  { id: 'mens-shirts', name: "Men’s shirts" },
  { id: 'womens-dresses', name: 'Dresses' },
  { id: 'tops', name: 'Tops' },
];
export const money = value => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value);
export function filterProducts(products, { category = 'all', query = '', sort = 'featured', savedOnly = false, saved = [], inStock = false }) {
  const q = query.trim().toLowerCase();
  const result = products.filter(p => (category === 'all' || p.category === category) &&
    (!q || (p.title + ' ' + (categories.find(c => c.id === p.category)?.name || '')).toLowerCase().includes(q)) &&
    (!savedOnly || saved.includes(p.id)) && (!inStock || p.stock > 0));
  if (sort === 'low') result.sort((a,b) => a.price - b.price);
  if (sort === 'high') result.sort((a,b) => b.price - a.price);
  if (sort === 'name') result.sort((a,b) => a.title.localeCompare(b.title));
  if (sort === 'newest') result.sort((a,b) => (Date.parse(b.meta?.createdAt) || 0) - (Date.parse(a.meta?.createdAt) || 0));
  return result;
}
export async function loadCatalog(signal, fetcher = fetch) {
  const results = await Promise.allSettled(categories.slice(1).map(async c => {
    const response = await fetcher('https://dummyjson.com/products/category/' + c.id + '?limit=0', { signal });
    if (!response.ok) throw new Error('Request failed: ' + response.status);
    const data = await response.json();
    if (!Array.isArray(data.products)) throw new Error('Invalid catalog response');
    return data.products.filter(p => Number.isFinite(p.id) && typeof p.title === 'string' && Number.isFinite(p.price));
  }));
  const products = [...new Map(results.flatMap(r => r.status === 'fulfilled' ? r.value : []).map(p => [p.id,p])).values()];
  return { products, failed: results.filter(r => r.status === 'rejected').length };
}
export function changeBag(bag, product, delta) {
  const existing = bag.find(p => p.id === product.id);
  const quantity = Math.max(0, Math.min(product.stock || 0, (existing?.quantity || 0) + delta));
  return quantity === 0 ? bag.filter(p => p.id !== product.id) :
    existing ? bag.map(p => p.id === product.id ? { ...p, quantity } : p) : [...bag, { ...product, quantity }];
}
