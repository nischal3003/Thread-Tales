"use client";

import Link from "next/link";
import Image from "next/image";
import SiteHeader from "@/components/SiteHeader";
import Footer from "@/components/Footer";
import { useCart } from "@/lib/cart-context";
import { FREE_SHIPPING_THRESHOLD, STANDARD_SHIPPING, formatPrice } from "@/lib/products";
import { useProducts } from "@/lib/use-products";
import styles from "./Cart.module.css";

export default function CartPage() {
  const { items, loaded, updateQty, removeFromCart } = useCart();
  const { products, error } = useProducts();

  if (error) {
    return (
      <>
        <SiteHeader />
        <section className={styles.section}>
          <h1>Your Bag</h1>
          <div className={styles.errorState}>
            <p className="text-muted">Something went wrong loading your bag. Please try again.</p>
            <button type="button" className="btn btn-primary" onClick={() => window.location.reload()}>
              Retry
            </button>
          </div>
        </section>
        <Footer />
      </>
    );
  }

  if (!loaded || !products) {
    return (
      <>
        <SiteHeader />
        <section className={styles.section}>
          <h1>Your Bag</h1>
          <div className={styles.layout}>
            <div>
              {[0, 1, 2].map((i) => (
                <div key={i} className={styles.skeletonLine}>
                  <div className={`skeleton ${styles.skeletonThumb}`} />
                  <div className={styles.skeletonDetails}>
                    <div className="skeleton" style={{ height: 16, width: "60%" }} />
                    <div className="skeleton" style={{ height: 13, width: "40%" }} />
                    <div className="skeleton" style={{ height: 32, width: 110 }} />
                  </div>
                </div>
              ))}
            </div>
            <div className={`card elev-sm ${styles.summary}`}>
              <div className="skeleton" style={{ height: 20, width: "50%", marginBottom: 20 }} />
              <div className="skeleton" style={{ height: 14, marginBottom: 12 }} />
              <div className="skeleton" style={{ height: 14, marginBottom: 20 }} />
              <div className="skeleton" style={{ height: 44 }} />
            </div>
          </div>
        </section>
        <Footer />
      </>
    );
  }

  const lines = items.map((line, index) => {
    const product = products.find((p) => p.id === line.productId);
    const stock = product?.sizes.find((s) => s.label === line.size)?.stock ?? 0;
    return { ...line, index, product, stock };
  });

  const subtotal = lines.reduce((sum, l) => sum + (l.product?.price ?? 0) * l.qty, 0);
  const shipping = subtotal === 0 || subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : STANDARD_SHIPPING;
  const total = subtotal + shipping;

  if (lines.length === 0) {
    return (
      <>
        <SiteHeader />
        <section className={styles.section}>
          <h1>Your Bag</h1>
          <div className={styles.emptyState}>
            <svg className={styles.emptyIcon} viewBox="0 0 24 24" width="40" height="40" aria-hidden="true">
              <path d="M6 8h12l-1 13H7L6 8z" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
              <path d="M9 8V6a3 3 0 0 1 6 0v2" fill="none" stroke="currentColor" strokeWidth="1.6" />
            </svg>
            <p className="text-muted">Your bag is waiting for its first chapter.</p>
            <Link href="/#shop" className="btn btn-primary">
              Shop the Edit
            </Link>
          </div>
        </section>
        <Footer />
      </>
    );
  }

  return (
    <>
      <SiteHeader />
      <section className={styles.section}>
        <h1>Your Bag</h1>
        <div className={styles.layout}>
          <div>
            {lines.map((l) => (
              <div key={`${l.productId}-${l.size}`} className={styles.line}>
                <div className={styles.thumb}>
                  {l.product && (
                    <Image src={l.product.images[0]} alt={l.product.name} fill sizes="100px" style={{ objectFit: "cover" }} />
                  )}
                </div>
                <div className={styles.lineDetails}>
                  <div className={styles.lineTop}>
                    <span className={styles.lineName}>{l.product?.name ?? "Unknown item"}</span>
                    <span className={styles.lineTotal}>{formatPrice((l.product?.price ?? 0) * l.qty)}</span>
                  </div>
                  <p className={`${styles.lineMeta} text-muted`}>
                    Size {l.size} · {formatPrice(l.product?.price ?? 0)} each
                  </p>
                  <div className={styles.lineActions}>
                    <div className={styles.stepper}>
                      <button
                        type="button"
                        className="btn-icon"
                        onClick={() => updateQty(l.index, l.qty - 1)}
                      >
                        −
                      </button>
                      <span className={styles.stepperValue}>{l.qty}</span>
                      <button
                        type="button"
                        className="btn-icon"
                        onClick={() => updateQty(l.index, Math.min(l.stock, l.qty + 1))}
                        disabled={l.qty >= l.stock}
                      >
                        +
                      </button>
                    </div>
                    <button type="button" className={styles.removeBtn} onClick={() => removeFromCart(l.index)}>
                      Remove
                    </button>
                  </div>
                  {l.qty >= l.stock && (
                    <p className={`${styles.lineMeta} text-muted`} style={{ margin: "6px 0 0" }}>
                      Max stock reached for this size.
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className={`card elev-sm ${styles.summary}`}>
            <h2 className="card-title">Order Summary</h2>
            {shipping > 0 ? (
              <div className={styles.shippingProgress}>
                <p className={styles.shippingProgressText}>
                  Add <strong>{formatPrice(FREE_SHIPPING_THRESHOLD - subtotal)}</strong> more for free shipping
                </p>
                <div className={styles.shippingBar}>
                  <div
                    className={styles.shippingBarFill}
                    style={{ width: `${Math.min(100, (subtotal / FREE_SHIPPING_THRESHOLD) * 100)}%` }}
                  />
                </div>
              </div>
            ) : (
              <p className={styles.shippingProgressText}>🎉 You&apos;ve unlocked free shipping!</p>
            )}
            <div className={styles.summaryRow}>
              <span className="text-muted">Subtotal</span>
              <span>{formatPrice(subtotal)}</span>
            </div>
            <div className={styles.summaryRow}>
              <span className="text-muted">Shipping</span>
              <span>{shipping === 0 ? "Free" : formatPrice(shipping)}</span>
            </div>
            <div className={styles.summaryTotal}>
              <span>Total</span>
              <span>{formatPrice(total)}</span>
            </div>
            <Link href="/checkout" className="btn btn-primary btn-block">
              Proceed to Checkout
            </Link>
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
}
