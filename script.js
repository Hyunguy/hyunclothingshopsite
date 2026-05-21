/* ============================================
   MAISON — Product catalog & sort filter
   ============================================ */

// Product data. `dateAdded` is an ISO date used for chronological sorting.
const products = [
  {
    id: 1,
    name: "Linen Camp Shirt",
    category: "Shirts",
    price: 145,
    dateAdded: "2026-04-12",
    tag: "New",
  },
  {
    id: 2,
    name: "Wide-Leg Trouser",
    category: "Trousers",
    price: 220,
    dateAdded: "2026-03-02",
    tag: null,
  },
  {
    id: 3,
    name: "Cashmere Crewneck",
    category: "Knitwear",
    price: 285,
    dateAdded: "2025-11-18",
    tag: null,
  },
  {
    id: 4,
    name: "Oversized Wool Coat",
    category: "Outerwear",
    price: 495,
    dateAdded: "2025-10-04",
    tag: null,
  },
  {
    id: 5,
    name: "Silk Slip Dress",
    category: "Dresses",
    price: 320,
    dateAdded: "2026-04-28",
    tag: "New",
  },
  {
    id: 6,
    name: "Cotton Pleated Skirt",
    category: "Skirts",
    price: 165,
    dateAdded: "2026-02-14",
    tag: null,
  },
  {
    id: 7,
    name: "Boxy Cropped Tee",
    category: "Tops",
    price: 65,
    dateAdded: "2026-05-01",
    tag: "New",
  },
  {
    id: 8,
    name: "Denim Wide Jean",
    category: "Denim",
    price: 195,
    dateAdded: "2025-09-22",
    tag: null,
  },
  {
    id: 9,
    name: "Alpaca Cardigan",
    category: "Knitwear",
    price: 340,
    dateAdded: "2025-12-08",
    tag: null,
  },
  {
    id: 10,
    name: "Tailored Blazer",
    category: "Outerwear",
    price: 410,
    dateAdded: "2026-01-19",
    tag: null,
  },
  {
    id: 11,
    name: "Merino Turtleneck",
    category: "Knitwear",
    price: 175,
    dateAdded: "2025-08-30",
    tag: null,
  },
  {
    id: 12,
    name: "Pleated Midi Dress",
    category: "Dresses",
    price: 275,
    dateAdded: "2026-03-21",
    tag: null,
  },
];

// Simple SVG placeholder so we don't depend on external images.
// Filled t-shirt silhouette — gives the brand artwork a fabric surface
// to sit on so it reads as a real garment print.
function placeholderSVG() {
  return `
    <svg viewBox="0 0 240 280" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <defs>
        <linearGradient id="fabric" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#f7f9f6"/>
          <stop offset="100%" stop-color="#e6ebe8"/>
        </linearGradient>
      </defs>
      <!-- T-shirt body + sleeves -->
      <path d="M70 36
               L96 26
               Q120 44 144 26
               L170 36
               L215 64
               L198 108
               L172 96
               L172 264
               L68 264
               L68 96
               L42 108
               L25 64 Z"
            fill="url(#fabric)"
            stroke="#9aa3a8"
            stroke-width="1"
            stroke-linejoin="round"/>
      <!-- Collar shadow -->
      <path d="M96 26 Q120 50 144 26"
            fill="none"
            stroke="#9aa3a8"
            stroke-width="1.2"/>
      <!-- Subtle fabric crease at the side seams -->
      <path d="M68 110 L68 260" fill="none" stroke="#c8cfcb" stroke-width="0.6"/>
      <path d="M172 110 L172 260" fill="none" stroke="#c8cfcb" stroke-width="0.6"/>
    </svg>
  `;
}

// Format a price as currency.
function formatPrice(value) {
  return `$${value.toLocaleString("en-US")}`;
}

// Render a single product card. Each garment carries the EVENTIDE brand logo.
function renderCard(product) {
  const tagHTML = product.tag
    ? `<span class="product-tag">${product.tag}</span>`
    : "";
  return `
    <article class="product-card" data-id="${product.id}">
      <div class="product-img">
        ${tagHTML}
        ${placeholderSVG()}
        <img src="eventide-logo.webp" alt="EVENTIDE" class="product-brand" />
      </div>
      <h3 class="product-name">${product.name}</h3>
      <p class="product-meta">${product.category}</p>
      <p class="product-price">${formatPrice(product.price)}</p>
    </article>
  `;
}

// Render the grid + update the count.
function renderGrid(list) {
  const grid = document.getElementById("productGrid");
  const count = document.getElementById("productCount");
  grid.innerHTML = list.map(renderCard).join("");
  count.textContent = list.length;

  // Stagger the fade-in animation per card.
  grid.querySelectorAll(".product-card").forEach((card, i) => {
    card.style.animationDelay = `${i * 40}ms`;
  });
}

/* ============================================
   SORT LOGIC
   --------------------------------------------
   Always sort a *copy* of the original array so
   the source order is preserved for "featured".
   ============================================ */
function sortProducts(list, mode) {
  const copy = [...list];

  switch (mode) {
    case "az":
      return copy.sort((a, b) => a.name.localeCompare(b.name));

    case "za":
      return copy.sort((a, b) => b.name.localeCompare(a.name));

    case "newest":
      return copy.sort(
        (a, b) => new Date(b.dateAdded) - new Date(a.dateAdded)
      );

    case "oldest":
      return copy.sort(
        (a, b) => new Date(a.dateAdded) - new Date(b.dateAdded)
      );

    case "priceLow":
      return copy.sort((a, b) => a.price - b.price);

    case "priceHigh":
      return copy.sort((a, b) => b.price - a.price);

    case "featured":
    default:
      return copy;
  }
}

// Wire up the dropdown.
function init() {
  const sortSelect = document.getElementById("sort");

  // Initial render in featured (source) order.
  renderGrid(products);

  sortSelect.addEventListener("change", (e) => {
    const sorted = sortProducts(products, e.target.value);
    renderGrid(sorted);
  });
}

document.addEventListener("DOMContentLoaded", init);