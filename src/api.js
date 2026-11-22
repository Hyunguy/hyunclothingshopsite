import axios from 'axios';
export const API_BASE = 'https://us-central1-nft-cloud-functions.cloudfunctions.net';
export const FILTERS = ['', 'price_low_to_high', 'price_high_to_low', 'likes_high_to_low'];
export function resourcePath(resource, value = '') {
  if (resource === 'explore') {
    if (!FILTERS.includes(value)) throw new Error('Invalid filter');
    return '/explore' + (value ? '?filter=' + value : '');
  }
  if (resource === 'authors' || resource === 'itemDetails') {
    if (!/^\d+$/.test(String(value))) throw new Error('Invalid identifier');
    return '/' + resource + '?' + (resource === 'authors' ? 'author' : 'nftId') + '=' + value;
  }
  if (!['hotCollections', 'newItems', 'topSellers'].includes(resource)) throw new Error('Unknown resource');
  return '/' + resource;
}
export async function fetchResource(path, signal) {
  const {data} = await axios.get(API_BASE + path, {signal, timeout: 20000});
  if (!data || typeof data !== 'object') throw new Error('Invalid API response');
  return data;
}
