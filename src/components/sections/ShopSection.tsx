"use client";

import { useMemo, useState } from "react";
import ProductCard from "@/components/ProductCard";
import Reveal from "@/components/Reveal";
import type { Product } from "@/lib/products";
import styles from "@/app/shop/Shop.module.css";

type Sort = "featured" | "price-asc" | "price-desc";

export default function ShopSection({ products }: { products: Product[] }) {
  const categories = useMemo(() => ["All", ...new Set(products.map((p) => p.category))], [products]);
  const [active, setActive] = useState("All");
  const [sort, setSort] = useState<Sort>("featured");
  const [query, setQuery] = useState("");

  const visible = useMemo(() => {
    let filtered = active === "All" ? products : products.filter((p) => p.category === active);

    const q = query.trim().toLowerCase();
    if (q) {
      filtered = filtered.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          p.tagline.toLowerCase().includes(q),
      );
    }

    if (sort === "featured") return filtered;
    const sorted = [...filtered];
    sorted.sort((a, b) => (sort === "price-asc" ? a.price - b.price : b.price - a.price));
    return sorted;
  }, [active, products, sort, query]);

  return (
    <div id="shop" className={styles.shopRoot}>
      <section className={styles.header}>
        <span className={styles.eyebrow}>Single Collection</span>
        <h1>The Chapter One Edit</h1>
        <p className={styles.headerSub}>{products.length} pieces, one collection.</p>
        <div className={styles.searchField}>
          <svg viewBox="0 0 20 20" width="16" height="16" aria-hidden="true">
            <circle cx="8.5" cy="8.5" r="6" fill="none" stroke="currentColor" strokeWidth="1.6" />
            <line x1="13" y1="13" x2="18" y2="18" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
          </svg>
          <input
            type="search"
            placeholder="Search dresses, tops, kurtas…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            aria-label="Search products"
          />
        </div>
      </section>

      <section className={styles.filterBar}>
        <div className={styles.categoryFilter}>
          {categories.map((cat) => (
            <label key={cat} className={styles.categoryOption}>
              <input type="radio" name="cat" checked={active === cat} onChange={() => setActive(cat)} />
              <span>{cat}</span>
            </label>
          ))}
        </div>
        <label className={styles.sortField}>
          <span>Sort</span>
          <select className={styles.sortSelect} value={sort} onChange={(e) => setSort(e.target.value as Sort)}>
            <option value="featured">Featured</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
          </select>
        </label>
      </section>

      <section className={styles.grid}>
        {visible.length > 0 ? (
          <div className={styles.gridInner}>
            {visible.map((p, i) => (
              <Reveal key={p.id} delay={(i % 4) * 80} className={styles.cardReveal}>
                <ProductCard product={p} />
              </Reveal>
            ))}
          </div>
        ) : (
          <p className={styles.empty}>
            {query ? `No pieces match "${query}".` : "No pieces in this category yet."}
          </p>
        )}
      </section>
    </div>
  );
}
