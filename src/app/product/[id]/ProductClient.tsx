"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import SiteHeader from "@/components/SiteHeader";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import { formatPrice, totalStock, type Product } from "@/lib/products";
import { useCart } from "@/lib/cart-context";
import { useWishlist } from "@/lib/wishlist-context";
import styles from "./Product.module.css";

export default function ProductClient({ product, related }: { product: Product; related: Product[] }) {
  const { addToCart } = useCart();
  const { isSaved, toggle } = useWishlist();
  const saved = isSaved(product.id);
  const soldOut = totalStock(product) === 0;

  const [size, setSize] = useState<string | null>(null);
  const [qty, setQty] = useState(1);
  const [careOpen, setCareOpen] = useState(false);
  const [shipOpen, setShipOpen] = useState(false);
  const [added, setAdded] = useState(false);
  const [activeImage, setActiveImage] = useState(0);
  const [zoomPos, setZoomPos] = useState<{ x: number; y: number } | null>(null);
  const [sizeGuideOpen, setSizeGuideOpen] = useState(false);

  useEffect(() => {
    setSize(null);
    setQty(1);
    setAdded(false);
    setActiveImage(0);
    setZoomPos(null);
    setSizeGuideOpen(false);
  }, [product.id]);

  useEffect(() => {
    if (!added) return;
    const t = setTimeout(() => setAdded(false), 1800);
    return () => clearTimeout(t);
  }, [added]);

  const selectedStock = product.sizes.find((s) => s.label === size)?.stock ?? 0;

  const handleAddToBag = () => {
    if (!size || selectedStock === 0) return;
    addToCart(product.id, size, qty);
    setAdded(true);
  };

  return (
    <>
      <SiteHeader />

      <div className={styles.breadcrumb}>
        <Link href="/">Home</Link> / <Link href="/#shop">Shop</Link> / <span>{product.name}</span>
      </div>

      <section className={styles.main}>
        <div>
          <div
            className={styles.imageWrap}
            onMouseMove={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              setZoomPos({
                x: ((e.clientX - rect.left) / rect.width) * 100,
                y: ((e.clientY - rect.top) / rect.height) * 100,
              });
            }}
            onMouseLeave={() => setZoomPos(null)}
          >
            <Image
              src={product.images[activeImage]}
              alt={product.name}
              fill
              sizes="(max-width: 900px) 100vw, 50vw"
              priority
              style={{
                objectFit: "cover",
                transform: zoomPos ? "scale(1.8)" : "scale(1)",
                transformOrigin: zoomPos ? `${zoomPos.x}% ${zoomPos.y}%` : "center",
                transition: zoomPos ? "none" : "transform 0.3s ease",
                cursor: "zoom-in",
              }}
            />
          </div>
          {product.images.length > 1 && (
            <div className={styles.thumbRow}>
              {product.images.map((src, i) => (
                <button
                  key={src}
                  type="button"
                  className={styles.thumb}
                  data-active={i === activeImage}
                  onClick={() => setActiveImage(i)}
                  aria-label={`Show photo ${i + 1} of ${product.name}`}
                >
                  <Image src={src} alt="" fill sizes="80px" style={{ objectFit: "cover" }} />
                </button>
              ))}
            </div>
          )}
        </div>

        <div>
          <span className={styles.category}>{product.category}</span>
          <h1 className={styles.name}>{product.name}</h1>
          <p className={`${styles.tagline} text-muted`}>&ldquo;{product.tagline}&rdquo;</p>
          <p className={styles.price}>{formatPrice(product.price)}</p>
          <p className={`${styles.desc} text-muted`}>{product.desc}</p>

          <div className={styles.sizeBlock}>
            <div className={styles.sizeLabelRow}>
              <span className={styles.sizeLabel}>Size</span>
              <button type="button" className={styles.sizeGuideLink} onClick={() => setSizeGuideOpen((v) => !v)}>
                Size Guide
              </button>
            </div>
            <div className="seg" style={{ flexWrap: "wrap" }}>
              {product.sizes.map((s) => (
                <label
                  key={s.label}
                  className="seg-opt"
                  style={s.stock === 0 ? { color: "var(--muted)", textDecoration: "line-through" } : undefined}
                >
                  <input
                    type="radio"
                    name="size"
                    checked={size === s.label}
                    disabled={s.stock === 0}
                    onChange={() => setSize(s.label)}
                  />
                  <span>{s.label}</span>
                </label>
              ))}
            </div>
            {sizeGuideOpen && (
              <table className={styles.sizeGuideTable}>
                <thead>
                  <tr>
                    <th>Size</th>
                    <th>Bust (in)</th>
                    <th>Waist (in)</th>
                    <th>Hip (in)</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>S</td>
                    <td>34</td>
                    <td>28</td>
                    <td>37</td>
                  </tr>
                  <tr>
                    <td>M</td>
                    <td>36</td>
                    <td>30</td>
                    <td>39</td>
                  </tr>
                  <tr>
                    <td>L</td>
                    <td>38</td>
                    <td>32</td>
                    <td>41</td>
                  </tr>
                  <tr>
                    <td>XL</td>
                    <td>40</td>
                    <td>34</td>
                    <td>43</td>
                  </tr>
                </tbody>
              </table>
            )}
          </div>

          <div className={styles.actionsRow}>
            <div className={styles.stepper}>
              <button type="button" className="btn-icon" onClick={() => setQty((q) => Math.max(1, q - 1))}>
                −
              </button>
              <span className={styles.stepperValue}>{qty}</span>
              <button
                type="button"
                className="btn-icon"
                onClick={() => setQty((q) => Math.min(selectedStock || 1, q + 1))}
                disabled={!size || qty >= selectedStock}
              >
                +
              </button>
            </div>
            <button
              type="button"
              className={`btn btn-primary ${styles.addBtn}`}
              onClick={handleAddToBag}
              disabled={soldOut || !size || selectedStock === 0}
            >
              {soldOut ? "Sold Out" : added ? "Added to Bag" : "Add to Bag"}
            </button>
            <button
              type="button"
              className={styles.wishlistToggle}
              data-saved={saved}
              aria-label={saved ? "Remove from wishlist" : "Add to wishlist"}
              aria-pressed={saved}
              onClick={() => toggle(product.id)}
            >
              <svg viewBox="0 0 24 24" width="19" height="19" aria-hidden="true">
                <path
                  d="M12 20.5s-7.5-4.6-10-9.3C.4 8 1.7 4.5 5 3.5c2.1-.6 4.2.3 5.3 2C11.5 3.8 13.6 2.9 15.7 3.5c3.3 1 4.6 4.5 3 7.7-2.5 4.7-10 9.3-10 9.3z"
                  fill={saved ? "currentColor" : "none"}
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>
          <p className={styles.note}>
            {soldOut ? "" : size ? (selectedStock <= 3 ? `Only ${selectedStock} left in size ${size}.` : "") : "Select a size to add to your bag."}
          </p>

          <div className={styles.accordions}>
            <button type="button" className={styles.accordionToggle} onClick={() => setCareOpen((v) => !v)}>
              <span>Fabric &amp; Care</span>
              <span>{careOpen ? "−" : "+"}</span>
            </button>
            {careOpen && <p className={styles.accordionBody}>{product.care}</p>}

            <button type="button" className={styles.accordionToggle} onClick={() => setShipOpen((v) => !v)}>
              <span>Shipping &amp; Returns</span>
              <span>{shipOpen ? "−" : "+"}</span>
            </button>
            {shipOpen && (
              <p className={styles.accordionBody}>
                Free shipping across India on orders over ₹1,999. Delivered in 3–6 business days. Returns accepted
                within 14 days, unworn and tagged.
              </p>
            )}
          </div>
        </div>
      </section>

      <section className={styles.related}>
        <h2>You May Also Like</h2>
        <div className={styles.relatedGrid}>
          {related.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>

      <Footer />
    </>
  );
}
