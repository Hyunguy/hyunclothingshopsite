const API_ENDPOINTS = [
  "https://dummyjson.com/products/category/mens-shirts",
  "https://dummyjson.com/products/category/womens-dresses",
  "https://dummyjson.com/products/category/tops",
];

let allProducts = [];
let currentSort = "featured";
let currentSearch = "";

async function fetchProducts() {
  const grid = document.getElementById("productGrid");
  grid.innerHTML = `<div class="state-message">Loading…</div>`;

  try {
    const responses = await Promise.all(API_ENDPOINTS.map((url) => fetch(url)));

    const failed = responses.find((r) => !r.ok);
    if (failed) throw new Error(`Request failed (${failed.status})`);

    const data = await Promise.all(responses.map((r) => r.json()));
    const raw = data.flatMap((d) => d.products);

    // API has no date field, so synthesize one from index for the date sorts.
    allProducts = raw.map((p, i) => ({
      id: p.id,
      name: p.title,
      category: formatCategory(p.category),
      price: Math.round(p.price),
      image: p.thumbnail,
      dateAdded: new Date(2026, 0, 1 + i * 5).toISOString().split("T")[0],
      tag: i < 3 ? "New" : null,
    }));

    render();
  } catch (err) {
    grid.innerHTML = `
      <div class="state-message state-error">
        <p>Couldn't load products. ${err.message}.</p>
        <button class="retry-btn" type="button" onclick="fetchProducts()">Retry</button>
      </div>
    `;
    document.getElementById("productCount").textContent = "0";
  }
}

function formatCategory(slug) {
  return slug
    .split("-")
    .map((w) => {
      if (w === "mens") return "Men's";
      if (w === "womens") return "Women's";
      return w[0].toUpperCase() + w.slice(1);
    })
    .join(" ");
}

function applyFilters(list) {
  let result = [...list];

  const q = currentSearch.trim().toLowerCase();
  if (q) {
    result = result.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q)
    );
  }

  switch (currentSort) {
    case "az":
      return result.sort((a, b) => a.name.localeCompare(b.name));
    case "za":
      return result.sort((a, b) => b.name.localeCompare(a.name));
    case "newest":
      return result.sort((a, b) => new Date(b.dateAdded) - new Date(a.dateAdded));
    case "oldest":
      return result.sort((a, b) => new Date(a.dateAdded) - new Date(b.dateAdded));
    case "priceLow":
      return result.sort((a, b) => a.price - b.price);
    case "priceHigh":
      return result.sort((a, b) => b.price - a.price);
    default:
      return result;
  }
}

function renderCard(p) {
  const tag = p.tag ? `<span class="product-tag">${p.tag}</span>` : "";
  return `
    <article class="product-card">
      <div class="product-img">
        ${tag}
        <img src="${p.image}" alt="${p.name}" class="product-photo" loading="lazy" />
      </div>
      <h3 class="product-name">${p.name}</h3>
      <p class="product-meta">${p.category}</p>
      <p class="product-price">$${p.price}</p>
    </article>
  `;
}

function render() {
  const list = applyFilters(allProducts);
  const grid = document.getElementById("productGrid");
  const count = document.getElementById("productCount");

  count.textContent = list.length;

  if (list.length === 0) {
    grid.innerHTML = `<div class="state-message">No items match "${escapeHTML(currentSearch)}".</div>`;
    return;
  }

  grid.innerHTML = list.map(renderCard).join("");
}

function escapeHTML(str) {
  const div = document.createElement("div");
  div.textContent = str;
  return div.innerHTML;
}

document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("sort").addEventListener("change", (e) => {
    currentSort = e.target.value;
    render();
  });

  let timer;
  document.getElementById("search").addEventListener("input", (e) => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      currentSearch = e.target.value;
      render();
    }, 150);
  });

  fetchProducts();
});