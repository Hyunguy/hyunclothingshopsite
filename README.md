# EVENTIDE — clothing marketplace

Deployment: https://hyunguy.github.io/hyunclothingshopsite/

A React clothing adaptation of the FES Virtual Internship. The user explicitly chose to retain clothing instead of the supplied NFT marketplace, and requested a plain shop layout with no hero or gradients.

## Run locally
Node 22 or later:
- npm ci
- npm run dev
- npm test
- npm run build

The app lives at /hyunclothingshopsite/. Hash routes let seller and item links survive refresh on GitHub Pages.

## Lesson requirements and implementation

All nine lesson audio tracks were transcribed locally and reviewed, alongside the course pages, starter source, and reference website. The transcripts are working material and are not published in this repository.

| Lesson | Behavior | Implementation |
| --- | --- | --- |
| Introduction | React, API data, reusable components, routing, version control | React 19, Axios, React Router, shared cards, feature branch and PR |
| Environment Setup | Separate branch, descriptive PR, update from main, retain branch | Existing Hyun repository retained by request; adaptation branch retained |
| Hot Collections | Six dynamic collections, 4/3/2/1 responsive carousel, move one, loop, skeletons, dynamic links | Collections resource, React Slick carousel, seller/item/collection routes |
| New Items | Seven records, same carousel, prices/likes, reusable timestamp countdown, skeletons | New arrivals resource, ItemCard and Countdown |
| Top Sellers | Twelve records, seller image/name/sales, profile links, skeletons | TopSellers with twelve fetched demo seller profiles |
| Explore Items | Eight first, four per Load more, price ascending/descending and most liked, fetch sorted results | Explore fetches distinct ordered JSON resources; displays slices of 8, 12, 16, etc. |
| Author | Route ID fetch, profile metadata, own items, follow +1/unfollow, skeletons | /author/:id, seller handle in place of wallet, client-only follow state |
| Item Details | Route ID fetch, title/image/description/price/views/likes, seller and creator links, skeletons | /item-details/:id with gallery and bag |
| Animations | AOS scroll animations; integrate current main before merging; deploy | Subtle AOS fade, reduced-motion support, GitHub Pages |

React Slick was chosen over Owl Carousel and Swiper because the lesson suggests Slick as one option and it directly supports a looping, one-slide step with responsive visible counts, without a jQuery dependency.

## Important adaptations for the reviewer
This is a clothing adaptation, not a pixel-for-pixel submission of the NFT starter. Acceptance for a FES certificate has not been verified with a mentor.
- Clothing, USD prices and seller handles replace NFTs, ETH and wallet addresses.
- The pre-existing Hyun repository is used rather than a fresh fork of the supplied starter.
- No hero, gradients or marketing filler, as requested.
- GitHub Pages is static hosting. Axios fetches versioned JSON responses under public/api. The generator prepares each sorted response ahead of deployment; changing the sort requests a new response and does not sort items in the browser. This is NOT a live query-processing backend or the FES API.
- Product data and images originate from DummyJSON. Seller identities, seller/creator assignments, likes, views, follower/sales counts and listing deadlines are explicitly sample fixtures added for this exercise.
- Thirty clothing items replace the reference's sixteen NFTs; pagination remains 8 initially and +4.
- Bag and saved items persist locally. Following stays in page state as the Author lesson demonstrates. No orders, payments or bids are submitted.
- Implementation is consolidated into a reviewable feature PR; it does not recreate one historical PR per lesson or simulate team conflicts.

## Data flow
scripts/build-catalog.mjs fetches six DummyJSON categories with Axios, validates them, and writes the versioned responses. Run npm run catalog explicitly to refresh the snapshot; ordinary builds are reproducible and do not depend on a live API.

Browser route -> useResource(resource) -> Axios GET -> payload validation -> loading/error/data state -> page -> shared ItemCard / SellerLink / Countdown.

Explore sort -> different ordered response -> search/category/stock filtering (preserves order) -> slice 8 + 4 per click.

Product and seller IDs determine the response path. Each item record's seller and creator resolve back to the correct profile and inventory. Requests time out after 15 seconds, abort on unmount/route changes, and expose retry controls. Stale responses cannot replace a newer route.

## Components
- src/App.jsx: app shell, hash routes, saved/bag state, informational dialogs.
- src/pages/Home.jsx: Collections, NewItems and TopSellers.
- src/pages/Explore.jsx: query controls and pagination.
- src/pages/Author.jsx: seller profile, follow state and inventory tabs.
- src/pages/ItemDetails.jsx: item view and seller/creator links.
- src/ui/MarketplaceUI.jsx: shared ItemCard, Countdown, Carousel, SellerLink, Skeletons and failure/empty states.
- src/components.jsx: image fallback, gallery/detail view, native dialog and bag.
- src/useResource.js and src/marketplace.js: request lifecycle, response validation and filter helpers.
- src/hooks.js and src/catalog.js: safe local persistence, currency formatting and stock-limited bag operations.

## Verification
Unit tests verify countdown boundaries, stock limits, removal, remote sort order, record uniqueness, every item/seller/creator relationship, composed search filters and malformed-response rejection.
Browser checks cover desktop/mobile layout, carousel movement, pagination, sorting, search, item links, seller follow/unfollow and direct-route refresh.
The Actions workflow runs tests and a production build before publishing.

## Known demo boundaries
No authentication, payment provider, real inventory reservation, live seller activity or size variants.
The fixed sample listing deadlines are in December 2026. They expire normally and never reset on refresh.
Product images remain an external dependency and use an unavailable-image fallback.
