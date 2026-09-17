import test from 'node:test';
import assert from 'node:assert/strict';
import { filterProducts, changeBag, loadCatalog } from './catalog.js';
const products = [{id:1,title:'Blue Shirt',category:'mens-shirts',price:29.99,stock:2},{id:2,title:'Red Dress',category:'womens-dresses',price:19.99,stock:0}];
test('search, category, stock and saved filters compose without mutating input', () => {
  assert.deepEqual(filterProducts(products,{query:' shirt ',category:'mens-shirts',inStock:true,savedOnly:true,saved:[1]}).map(p=>p.id),[1]);
  assert.deepEqual(filterProducts(products,{sort:'low'}).map(p=>p.id),[2,1]);
  assert.equal(products[0].id,1);
  assert.equal(filterProducts(products,{query:'missing'}).length,0);
});
test('bag merges quantities, enforces stock and removes zero quantity', () => {
  const bag=changeBag([],products[0],1);
  const full=changeBag(bag,products[0],5);
  assert.equal(full[0].quantity,2);
  assert.equal(changeBag(full,products[0],-2).length,0);
  assert.equal(changeBag([],products[1],1).length,0);
});
test('one category failure preserves available products', async () => {
  const data=await loadCatalog(undefined,async url=>url.includes('tops') ? {ok:false,status:503} : {ok:true,json:async()=>({products})});
  assert.equal(data.failed,1);assert.equal(data.products.length,2);
});
test('total failure and invalid payloads become retryable state', async () => {
  const data=await loadCatalog(undefined,async()=>({ok:true,json:async()=>({wrong:[]})}));
  assert.equal(data.failed,3);assert.deepEqual(data.products,[]);
});
