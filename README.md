# Ultraverse NFT marketplace

React implementation of the FES Virtual Internship, rebuilt from the [supplied starter](https://github.com/hannamitri/nft-marketplace-starter) to match the [Ultraverse reference](https://nft-marketplacee.web.app/).

**Live:** https://hyunguy.github.io/hyunclothingshopsite/

## Setup

Node 22+: `npm ci`, `npm run dev`, `npm test`, `npm run build`.
Vite builds to dist. GitHub Actions runs tests and builds before deploying main. HashRouter preserves direct author/item links on GitHub Pages.

## Lessons implemented

- Hot Collections: Axios data, six collections, looping carousel, one-card step, 4/3/2/1 responsive counts, dynamic item/author links, skeletons.
- New Items: seven API records, reusable NFT card and optional countdown from the API's millisecond expiry timestamp.
- Top Sellers: twelve sellers, dynamic portraits/names/ETH totals and author links, skeletons.
- Explore: the same NFT card and countdown, eight initial items, four per Load more, all three sorting options fetched from the backend.
- Author: route ID fetch, portrait/name/tag/wallet/followers/owned NFTs, wallet copy, client-only Follow/Unfollow (+1/-1, resets on refresh).
- Item Details: route ID fetch, title/tag/image/description/views/likes/price, owner and creator profile links, skeletons.
- Animations: AOS fade-up/fade-in/fade-right with reduced-motion support.

## Data flow

Route or filter -> useResource -> Axios -> course cloud API -> loading/error/data -> page -> shared components.
Requests abort when routes change or components unmount; retry controls handle network errors. The browser does not sort NFT records.

API base: https://us-central1-nft-cloud-functions.cloudfunctions.net

| Feature     | Request                                                                          |
| ----------- | -------------------------------------------------------------------------------- |
| Collections | /hotCollections                                                                  |
| New Items   | /newItems                                                                        |
| Sellers     | /topSellers                                                                      |
| Explore     | /explore?filter=price_low_to_high (also price_high_to_low and likes_high_to_low) |
| Author      | /authors?author=AUTHOR_ID                                                        |
| Details     | /itemDetails?nftId=NFT_ID                                                        |

The real course API supplies all NFT and author data. There are no clothing snapshots, fabricated seller records or fallback datasets.

## Structure

- components/home: original landing/intro/categories and API-powered collections/items/sellers.
- components/UI: Carousel, NftCard, Countdown, Skeleton and LoadError.
- components/explore and components/author: reusable card lists.
- pages: Home, Explore, Author and ItemDetails.
- api.js/useResource.js: request contracts and cancellable loading lifecycle.
- css/images: original starter styling, fonts and artwork; enhancements.css only bridges carousel, accessibility and responsive behavior.

React Slick was selected from the lesson's Owl, Keen and Slick options for its React integration and built-in looping/responsive controls without jQuery. Carousel and NFT cards are shared rather than duplicated.

## Git workflow and scope

Each lesson feature has its own descriptive pull request and retained feature branch. Each branch incorporates current main before merge. See the repository PR history; the earlier clothing implementation remains in Git history.

The original starter layout, colors, imagery, footer and demo wallet behavior are retained. Wallet connection, buying and newsletter subscription are not backend features in this assignment. No funds are transferred and no email is submitted. The existing repository and Pages address are retained as requested, rather than creating a new fork.

## Verification

Tests cover countdown boundaries and exact API query contracts. Browser verification covers carousel steps, desktop/mobile layouts, Explore sorting and pagination, item/author routing, follow/unfollow and direct-link refresh. Live API checks verify record counts, remote sorting and referenced author/item IDs.
