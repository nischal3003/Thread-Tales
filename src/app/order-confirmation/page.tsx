"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import SiteHeader from "@/components/SiteHeader";
import Footer from "@/components/Footer";
import styles from "./OrderConfirmation.module.css";

export default function OrderConfirmationPage() {
  const [order, setOrder] = useState<{ orderNumber: string; total: string } | null>(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("tt_last_order");
      if (raw) setOrder(JSON.parse(raw));
    } catch {
      // no snapshot available — placeholders render instead
    }
  }, []);

  return (
    <>
      <SiteHeader />
      <section className={styles.section}>
        <div className={styles.iconCircle}>
          <svg width="30" height="30" viewBox="0 0 30 30">
            <polyline
              points="7,15 12,21 23,8"
              fill="none"
              stroke="var(--text)"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
        <span className="eyebrow">Order Confirmed</span>
        <h1>Thank you — your tale continues.</h1>
        <p className={`${styles.lede} text-muted`}>
          A confirmation has been sent to your email. Your order is being prepared for its first chapter.
        </p>

        <div className={`card ${styles.card}`}>
          <div className={styles.row}>
            <span className="text-muted">Order Number</span>
            <span style={{ fontFamily: "var(--font-sans)", fontWeight: 800 }}>{order?.orderNumber ?? "—"}</span>
          </div>
          <div className={styles.row}>
            <span className="text-muted">Estimated Delivery</span>
            <span>3–6 business days</span>
          </div>
          <div className={styles.total}>
            <span>Total Paid</span>
            <span>{order?.total ?? "—"}</span>
          </div>
        </div>

        <div className={styles.actions}>
          <Link href="/#shop" className="btn btn-primary">
            Continue Shopping
          </Link>
          <Link href="/" className="btn btn-ghost">
            Back to Home
          </Link>
        </div>
      </section>
      <Footer />
    </>
  );
}
