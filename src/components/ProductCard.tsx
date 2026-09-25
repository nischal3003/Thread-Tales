"use client";

import Link from "next/link";
import Image from "next/image";
import type { Product } from "@/lib/products";
import { formatPrice, totalStock } from "@/lib/products";
import { useWishlist } from "@/lib/wishlist-context";
import styles from "./ProductCard.module.css";

const LOW_STOCK_THRESHOLD = 3;

export default function ProductCard({ product }: { product: Product }) {
  const stock = totalStock(product);
  const soldOut = stock === 0;
  const lowStock = !soldOut && stock <= LOW_STOCK_THRESHOLD;
  const { isSaved, toggle } = useWishlist();
  const saved = isSaved(product.id);

  return (
    <Link href={`/product/${product.slug}`} className={styles.card}>
      <div className={`${styles.imageWrap} ${soldOut ? styles.soldOutImage : ""}`}>
        <Image
          src={product.images[0]}
          alt={product.name}
          fill
          sizes="(max-width: 560px) 100vw, (max-width: 900px) 50vw, 25vw"
          className={styles.imageInner}
        />
        {product.isNew && !soldOut && <span className={`tag tag-accent-2 ${styles.newTag}`}>New</span>}
        {soldOut && <span className={`tag tag-muted ${styles.stockTag}`}>Sold Out</span>}
        {lowStock && <span className={`tag tag-accent ${styles.stockTag}`}>Only {stock} left</span>}
        <button
          type="button"
          className={styles.wishlistBtn}
          data-saved={saved}
          aria-label={saved ? "Remove from wishlist" : "Add to wishlist"}
          aria-pressed={saved}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            toggle(product.id);
          }}
        >
          <svg viewBox="0 0 24 24" width="17" height="17" aria-hidden="true">
            <path
              d="M12 20.5s-7.5-4.6-10-9.3C.4 8 1.7 4.5 5 3.5c2.1-.6 4.2.3 5.3 2C11.5 3.8 13.6 2.9 15.7 3.5c3.3 1 4.6 4.5 3 7.7-2.5 4.7-10 9.3-10 9.3z"
              fill={saved ? "currentColor" : "none"}
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinejoin="round"
            />
          </svg>
        </button>
        <span className={styles.quickView}>{soldOut ? "View Details" : "Quick View"}</span>
      </div>
      <span className={styles.category}>{product.category}</span>
      <span className={styles.name}>{product.name}</span>
      <span className={styles.price}>{formatPrice(product.price)}</span>
    </Link>
  );
}
