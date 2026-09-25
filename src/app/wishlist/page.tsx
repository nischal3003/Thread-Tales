"use client";

import Link from "next/link";
import SiteHeader from "@/components/SiteHeader";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import { useWishlist } from "@/lib/wishlist-context";
import { useProducts } from "@/lib/use-products";
import styles from "./Wishlist.module.css";

export default function WishlistPage() {
  const { ids, loaded: wishlistLoaded } = useWishlist();
  const { products, error } = useProducts();

  if (error) {
    return (
      <>
        <SiteHeader />
        <section className={styles.section}>
          <h1>Your Wishlist</h1>
          <div className={styles.emptyState}>
            <p className="text-muted">Something went wrong loading your wishlist. Please try again.</p>
            <button type="button" className="btn btn-primary" onClick={() => window.location.reload()}>
              Retry
            </button>
          </div>
        </section>
        <Footer />
      </>
    );
  }

  if (!wishlistLoaded || !products) {
    return (
      <>
        <SiteHeader />
        <section className={styles.section}>
          <h1>Your Wishlist</h1>
          <div className={styles.grid}>
            {[0, 1, 2, 3].map((i) => (
              <div key={i}>
                <div className="skeleton" style={{ aspectRatio: "3 / 4", borderRadius: 16, marginBottom: 14 }} />
                <div className="skeleton" style={{ height: 14, width: "60%", marginBottom: 8 }} />
                <div className="skeleton" style={{ height: 14, width: "30%" }} />
              </div>
            ))}
          </div>
        </section>
        <Footer />
      </>
    );
  }

  const saved = products.filter((p) => ids.includes(p.id));

  return (
    <>
      <SiteHeader />
      <section className={styles.section}>
        <h1>Your Wishlist</h1>
        {saved.length === 0 ? (
          <div className={styles.emptyState}>
            <p className="text-muted">Nothing saved yet — tap the heart on anything you love.</p>
            <Link href="/#shop" className="btn btn-primary">
              Shop the Edit
            </Link>
          </div>
        ) : (
          <div className={styles.grid}>
            {saved.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </section>
      <Footer />
    </>
  );
}
