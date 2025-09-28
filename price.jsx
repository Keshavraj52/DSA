/*
ProductPriceComparer.jsx
Single-file React component (JSX) for a one-stop product price comparison page.

Features:
- Search bar (mirrors Amazon's input element) to enter brand/model/keywords
- Queries multiple backend endpoints (amazon, flipkart, croma, etc.) and merges results
- Displays a comparison table and product cards
- Sorting, filtering, and quick 'open on site' links
- Uses Tailwind CSS for styling (no imports required here; include Tailwind in your app)
- Fallback to mock data if backend endpoints are not available

Important Backend Notes (you must implement or use a 3rd-party service):
- Browsers block cross-site scraping (CORS). You must implement a server-side aggregator that queries each retailer (official APIs, affiliate APIs, or a scraping service like BrightData/SerpApi/Apify) and returns unified JSON to this frontend.
- Example backend endpoints used in this file: /api/search?site=amazon&q=..., /api/search?site=flipkart&q=... . Adjust to your backend routes.
- Be mindful of each site's Terms of Service and robots.txt when scraping.

How to use:
1. Add this component to your React app (e.g., src/components/ProductPriceComparer.jsx).
2. Ensure Tailwind CSS is configured in your project.
3. Implement backend endpoints or point the fetch calls to real APIs and update the `SITES` array.

This file intentionally keeps logic on the frontend minimal and expects an aggregator backend. A working demo without a backend is provided via `mockFetch`.
*/

import React, { useState, useEffect, useMemo } from "react";

// Configuration: change site slugs and friendly names to match your backend
const SITES = [
  { key: "amazon", name: "Amazon.in" },
  { key: "flipkart", name: "Flipkart" },
  { key: "croma", name: "Croma" },
  { key: "tatacliq", name: "TataCliq" },n
];

// Mock data is used if backend is not reachable. Remove or replace for production.
const MOCK_DATA = {
  amazon: [
    {
      id: "amz-1",
      title: "ExamplePhone X (6GB RAM, 128GB)",
      brand: "ExamplePhone",
      price: 17999,
      mrp: 19999,
      discountPercent: 10,
      rating: 4.2,
      reviews: 1245,
      url: "https://amazon.in/dp/example",
      image: "https://via.placeholder.com/120",
      offers: ["Bank offer: 5% cashback up to ₹1500"],
    },
  ],
  flipkart: [
    {
      id: "flp-1",
      title: "ExamplePhone X (6GB RAM, 128GB)",
      brand: "ExamplePhone",
      price: 17499,
      mrp: 19999,
      discountPercent: 12.5,
      rating: 4.1,
      reviews: 980,
      url: "https://flipkart.com/item/example",
      image: "https://via.placeholder.com/120",
      offers: ["Exchange offer: up to ₹5000 off"],
    },
  ],
  croma: [],
  tatacliq: [],
};

// Helper: attempt a real fetch to backend; fall back to mock when needed
async function fetchSiteResults(siteKey, query) {
  const encoded = encodeURIComponent(query);
  try {
    // Backend endpoint expected to return JSON array of products for the given site
    const resp = await fetch(`/api/search?site=${siteKey}&q=${encoded}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });
    if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
    const json = await resp.json();
    return json;
  } catch (e) {
    // console.warn("Backend fetch failed for", siteKey, e);
    // fallback to mock data
    await new Promise((r) => setTimeout(r, 300)); // emulate latency
    return MOCK_DATA[siteKey] || [];
  }
}

// Utility: merge normalized products by a matching key (title similarity or brand+model)
function normalizeProduct(raw, siteKey) {
  return {
    site: siteKey,
    id: raw.id || `${siteKey}-${Math.random().toString(36).slice(2, 8)}`,
    title: raw.title || raw.name || "Untitled",
    brand: raw.brand || "",
    price: Number(raw.price || raw.current_price || raw.offer_price || 0),
    mrp: Number(raw.mrp || raw.list_price || raw.strike_price || raw.price || 0),
    discountPercent:
      raw.discountPercent || raw.discount_percent || Math.round(((raw.mrp && raw.price) ? ((raw.mrp - raw.price) / raw.mrp) * 100 : 0) * 100) / 100,
    rating: raw.rating || raw.stars || 0,
    reviews: raw.reviews || raw.num_reviews || 0,
    url: raw.url || raw.link || "#",
    image: raw.image || raw.thumbnail || "https://via.placeholder.com/120",
    offers: raw.offers || raw.promotions || [],
  };
}

function titleKey(s) {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim()
    .replace(/\s+/g, " ");
}

function similar(a, b) {
  // crude similarity: check if normalized tokens intersect heavily
  const A = new Set(titleKey(a).split(" "));
  const B = new Set(titleKey(b).split(" "));
  let inter = 0;
  for (const t of A) if (B.has(t)) inter++;
  const score = inter / Math.max(A.size, B.size || 1);
  return score; // 0 .. 1
}

export default function ProductPriceComparer() {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState([]); // array of normalized products
  const [error, setError] = useState(null);
  const [sortBy, setSortBy] = useState("price-asc");
  const [filterSite, setFilterSite] = useState("all");

  useEffect(() => {
    // optional: read query from URL param
    const params = new URLSearchParams(window.location.search);
    const q = params.get("q");
    if (q) setQuery(q);
  }, []);

  async function handleSearch(e) {
    if (e) e.preventDefault();
    if (!query.trim()) return;
    setLoading(true);
    setError(null);

    try {
      // fetch in parallel for each site
      const promises = SITES.map((s) => fetchSiteResults(s.key, query).then((arr) => ({ site: s.key, arr })));
      const siteResults = await Promise.all(promises);

      // normalize and flatten
      let flat = [];
      for (const s of siteResults) {
        for (const raw of s.arr) flat.push(normalizeProduct(raw, s.site));
      }

      // naive grouping: find one product per 'model' using title similarity
      const grouped = [];
      for (const p of flat) {
        let found = false;
        for (const g of grouped) {
          // compare to representative title
          if (similar(g.rep.title, p.title) > 0.55) {
            g.items.push(p);
            if (p.price < g.rep.price) g.rep = p;
            found = true;
            break;
          }
        }
        if (!found) grouped.push({ rep: p, items: [p] });
      }

      // sort groups by best price
      grouped.sort((a, b) => a.rep.price - b.rep.price);

      // transform to display shape
      const display = grouped.map((g) => ({
        title: g.rep.title,
        brand: g.rep.brand,
        bestPrice: g.rep.price,
        bestSite: g.rep.site,
        offers: [...new Set(g.items.flatMap((i) => i.offers || []))],
        sellers: g.items,
      }));

      setResults(display);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch results. See console for details.");
    } finally {
      setLoading(false);
    }
  }

  const filtered = useMemo(() => {
    let out = results.slice();
    if (filterSite !== "all") {
      out = out.filter((g) => g.sellers.some((s) => s.site === filterSite));
    }
    // sorting
    if (sortBy === "price-asc") out.sort((a, b) => a.bestPrice - b.bestPrice);
    else if (sortBy === "price-desc") out.sort((a, b) => b.bestPrice - a.bestPrice);
    else if (sortBy === "discount") out.sort((a, b) => {
      const da = Math.max(...a.sellers.map((s) => s.discountPercent || 0));
      const db = Math.max(...b.sellers.map((s) => s.discountPercent || 0));
      return db - da;
    });

    return out;
  }, [results, filterSite, sortBy]);

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <header className="mb-6">
        <h1 className="text-2xl font-bold">One-Stop Product Price Comparator</h1>
        <p className="text-sm text-gray-600">Search a brand/model and compare prices across multiple Indian retailers.</p>
      </header>

      <form onSubmit={handleSearch} className="flex gap-2 mb-4">
        {/* Mirror of Amazon input box attributes where useful */}
        <input
          id="twotabsearchtextbox"
          name="field-keywords"
          role="searchbox"
          aria-label="Search Amazon.in"
          autoComplete="off"
          placeholder="Search brand / model (e.g. Redmi Note 12)"
          className="nav-input nav-progressive-attribute flex-1 border rounded px-4 py-2 focus:outline-none focus:ring-2"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          disabled={loading}
        >
          {loading ? "Searching..." : "Search"}
        </button>
      </form>

      <div className="flex items-center gap-4 mb-6">
        <label className="text-sm">Filter by site:</label>
        <select value={filterSite} onChange={(e) => setFilterSite(e.target.value)} className="p-2 border rounded">
          <option value="all">All sites</option>
          {SITES.map((s) => (
            <option key={s.key} value={s.key}>{s.name}</option>
          ))}
        </select>

        <label className="text-sm ml-4">Sort:</label>
        <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="p-2 border rounded">
          <option value="price-asc">Price: Low → High</option>
          <option value="price-desc">Price: High → Low</option>
          <option value="discount">Max Discount</option>
        </select>

        <div className="ml-auto text-sm text-gray-500">Found <strong>{results.length}</strong> product groups</div>
      </div>

      {error && <div className="mb-4 text-red-600">{error}</div>}

      <main>
        {filtered.length === 0 && !loading ? (
          <div className="text-gray-600">No results yet. Enter a product and click Search.</div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {filtered.map((g, idx) => (
              <div key={idx} className="p-4 border rounded shadow-sm flex gap-4 items-center">
                <img src={g.sellers[0].image} alt="product" className="w-28 h-28 object-contain" />
                <div className="flex-1">
                  <div className="flex items-start gap-4">
                    <div>
                      <h2 className="text-lg font-semibold">{g.title}</h2>
                      <div className="text-sm text-gray-600">Brand: {g.brand || '—'}</div>
                    </div>
                    <div className="ml-auto text-right">
                      <div className="text-2xl font-bold">₹{g.bestPrice.toLocaleString()}</div>
                      <div className="text-sm text-gray-500">Best on {g.bestSite}</div>
                    </div>
                  </div>

                  <div className="mt-3 flex gap-3">
                    {g.sellers.slice(0, 4).map((s) => (
                      <a key={s.id} href={s.url} target="_blank" rel="noreferrer" className="p-2 border rounded shadow-sm flex gap-2 items-center w-64">
                        <img src={s.image} alt="sitelogo" className="w-10 h-10 object-contain" />
                        <div className="text-sm">
                          <div className="font-medium">{SITES.find(x=>x.key===s.site)?.name || s.site}</div>
                          <div>₹{s.price.toLocaleString()}</div>
                          <div className="text-xs text-gray-500">{s.offers?.[0] || (s.discountPercent ? `${s.discountPercent}% off` : '')}</div>
                        </div>
                      </a>
                    ))}

                    <div className="ml-2">
                      <button
                        className="px-3 py-2 border rounded bg-white"
                        onClick={() => {
                          // show full modal or detailed comparison in a simple alert for now
                          const lines = g.sellers.map((x) => `${SITES.find(s=>s.key===x.site)?.name||x.site}: ₹${x.price} — ${x.offers?.join('; ') || ''}`);
                          alert(`${g.title}\n\n${lines.join('\n')}`);
                        }}
                      >
                        View all sellers
                      </button>
                    </div>
                  </div>

                  {g.offers.length > 0 && (
                    <div className="mt-3 text-sm text-green-700">Offers: {g.offers.join(' • ')}</div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      <footer className="mt-8 text-xs text-gray-500">
        Note: This frontend requires a server-side aggregator/API to fetch data from retailer websites. The component will use mock data if backend calls fail.
      </footer>
    </div>
  );
}
