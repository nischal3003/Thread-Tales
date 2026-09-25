"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import SiteHeader from "@/components/SiteHeader";
import Footer from "@/components/Footer";
import { useCart } from "@/lib/cart-context";
import { EXPRESS_SHIPPING, FREE_SHIPPING_THRESHOLD, STANDARD_SHIPPING, formatPrice } from "@/lib/products";
import { useProducts } from "@/lib/use-products";
import styles from "./Checkout.module.css";

type ShipMethod = "standard" | "express";

type FormState = {
  email: string;
  phone: string;
  fullName: string;
  address: string;
  city: string;
  pin: string;
  state: string;
  cardNumber: string;
  expiry: string;
  cvc: string;
};

const EMPTY_FORM: FormState = {
  email: "",
  phone: "",
  fullName: "",
  address: "",
  city: "",
  pin: "",
  state: "",
  cardNumber: "",
  expiry: "",
  cvc: "",
};

function validate(form: FormState): Partial<Record<keyof FormState, string>> {
  const errors: Partial<Record<keyof FormState, string>> = {};
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errors.email = "Enter a valid email address.";
  if (!/^\d{10}$/.test(form.phone.replace(/\D/g, ""))) errors.phone = "Enter a valid 10-digit phone number.";
  if (!form.fullName.trim()) errors.fullName = "Full name is required.";
  if (!form.address.trim()) errors.address = "Address is required.";
  if (!form.city.trim()) errors.city = "City is required.";
  if (!/^\d{6}$/.test(form.pin.trim())) errors.pin = "Enter a valid 6-digit PIN code.";
  if (!form.state.trim()) errors.state = "State is required.";
  if (!/^\d{12,19}$/.test(form.cardNumber.replace(/\s/g, ""))) errors.cardNumber = "Enter a valid card number.";
  if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(form.expiry.trim())) errors.expiry = "Use MM/YY format.";
  if (!/^\d{3,4}$/.test(form.cvc.trim())) errors.cvc = "Enter a valid CVC.";
  return errors;
}

export default function CheckoutPage() {
  const { items, loaded, clearCart } = useCart();
  const { products, error } = useProducts();
  const router = useRouter();

  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({});
  const [shipMethod, setShipMethod] = useState<ShipMethod>("standard");
  const [submitting, setSubmitting] = useState(false);

  function setField(key: keyof FormState, value: string) {
    setForm((f) => ({ ...f, [key]: value }));
    if (errors[key]) setErrors((e) => ({ ...e, [key]: undefined }));
  }

  if (error) {
    return (
      <>
        <SiteHeader />
        <section className={styles.section}>
          <div>
            <h1>Checkout</h1>
            <div className={styles.errorState}>
              <p className="text-muted">Something went wrong loading your order. Please try again.</p>
              <button type="button" className="btn btn-primary" onClick={() => window.location.reload()}>
                Retry
              </button>
            </div>
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
          <div className={styles.skeletonSection}>
            <div className="skeleton" style={{ height: 32, width: "40%", marginBottom: 8 }} />
            <div className="skeleton" style={{ height: 48 }} />
            <div className="skeleton" style={{ height: 48 }} />
            <div className="skeleton" style={{ height: 48 }} />
            <div className="skeleton" style={{ height: 48 }} />
          </div>
          <div className={`card elev-sm ${styles.summary}`}>
            <div className="skeleton" style={{ height: 20, width: "50%", marginBottom: 20 }} />
            <div className="skeleton" style={{ height: 14, marginBottom: 12 }} />
            <div className="skeleton" style={{ height: 44 }} />
          </div>
        </section>
        <Footer />
      </>
    );
  }

  const lines = items.map((line) => ({ ...line, product: products.find((p) => p.id === line.productId) }));
  const subtotal = lines.reduce((sum, l) => sum + (l.product?.price ?? 0) * l.qty, 0);
  const standardShipping = subtotal === 0 || subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : STANDARD_SHIPPING;
  const shipping = shipMethod === "express" ? EXPRESS_SHIPPING : standardShipping;
  const total = subtotal + shipping;

  const placeOrder = () => {
    const validationErrors = validate(form);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setSubmitting(true);
    setTimeout(() => {
      const orderNumber = "TT-" + Math.floor(100000 + Math.random() * 900000);
      try {
        localStorage.setItem("tt_last_order", JSON.stringify({ orderNumber, total: formatPrice(total) }));
      } catch {
        // ignore storage failures — confirmation page falls back to placeholders
      }
      clearCart();
      router.push("/order-confirmation");
    }, 600);
  };

  return (
    <>
      <SiteHeader />
      <section className={styles.section}>
        <div>
          <h1>Checkout</h1>

          <h2 className={styles.groupTitle}>Contact</h2>
          <div className={styles.fieldGrid}>
            <div className="field">
              <input
                type="email"
                placeholder="Email address"
                className={`input ${errors.email ? styles.inputError : ""}`}
                value={form.email}
                onChange={(e) => setField("email", e.target.value)}
              />
              {errors.email && <span className={styles.errorText}>{errors.email}</span>}
            </div>
            <div className="field">
              <input
                type="tel"
                placeholder="Phone number"
                className={`input ${errors.phone ? styles.inputError : ""}`}
                value={form.phone}
                onChange={(e) => setField("phone", e.target.value)}
              />
              {errors.phone && <span className={styles.errorText}>{errors.phone}</span>}
            </div>
          </div>

          <h2 className={styles.groupTitle}>Shipping Address</h2>
          <div className={styles.addressGrid}>
            <div className={styles.spanFull}>
              <input
                type="text"
                placeholder="Full name"
                className={`input ${errors.fullName ? styles.inputError : ""}`}
                value={form.fullName}
                onChange={(e) => setField("fullName", e.target.value)}
              />
              {errors.fullName && <span className={styles.errorText}>{errors.fullName}</span>}
            </div>
            <div className={styles.spanFull}>
              <input
                type="text"
                placeholder="Address"
                className={`input ${errors.address ? styles.inputError : ""}`}
                value={form.address}
                onChange={(e) => setField("address", e.target.value)}
              />
              {errors.address && <span className={styles.errorText}>{errors.address}</span>}
            </div>
            <div>
              <input
                type="text"
                placeholder="City"
                className={`input ${errors.city ? styles.inputError : ""}`}
                value={form.city}
                onChange={(e) => setField("city", e.target.value)}
              />
              {errors.city && <span className={styles.errorText}>{errors.city}</span>}
            </div>
            <div>
              <input
                type="text"
                placeholder="PIN code"
                className={`input ${errors.pin ? styles.inputError : ""}`}
                value={form.pin}
                onChange={(e) => setField("pin", e.target.value)}
              />
              {errors.pin && <span className={styles.errorText}>{errors.pin}</span>}
            </div>
            <div className={styles.spanFull}>
              <input
                type="text"
                placeholder="State"
                className={`input ${errors.state ? styles.inputError : ""}`}
                value={form.state}
                onChange={(e) => setField("state", e.target.value)}
              />
              {errors.state && <span className={styles.errorText}>{errors.state}</span>}
            </div>
          </div>

          <h2 className={styles.groupTitle}>Shipping Method</h2>
          <div className={styles.shipOptions}>
            <label className={`radio ${styles.shipOption}`}>
              <span className={styles.shipLabel}>
                <input
                  type="radio"
                  name="ship"
                  checked={shipMethod === "standard"}
                  onChange={() => setShipMethod("standard")}
                />
                <span className="dot" />
                Standard — 3–6 business days
              </span>
              <span>{standardShipping === 0 ? "Free" : formatPrice(standardShipping)}</span>
            </label>
            <label className={`radio ${styles.shipOption}`}>
              <span className={styles.shipLabel}>
                <input
                  type="radio"
                  name="ship"
                  checked={shipMethod === "express"}
                  onChange={() => setShipMethod("express")}
                />
                <span className="dot" />
                Express — 1–2 business days
              </span>
              <span>{formatPrice(EXPRESS_SHIPPING)}</span>
            </label>
          </div>

          <h2 className={styles.groupTitle}>Payment</h2>
          <div className={styles.paymentGrid}>
            <div>
              <input
                type="text"
                placeholder="Card number"
                className={`input ${errors.cardNumber ? styles.inputError : ""}`}
                value={form.cardNumber}
                onChange={(e) => setField("cardNumber", e.target.value)}
              />
              {errors.cardNumber && <span className={styles.errorText}>{errors.cardNumber}</span>}
            </div>
            <div className={styles.paymentRow}>
              <div>
                <input
                  type="text"
                  placeholder="MM / YY"
                  className={`input ${errors.expiry ? styles.inputError : ""}`}
                  value={form.expiry}
                  onChange={(e) => setField("expiry", e.target.value)}
                />
                {errors.expiry && <span className={styles.errorText}>{errors.expiry}</span>}
              </div>
              <div>
                <input
                  type="text"
                  placeholder="CVC"
                  className={`input ${errors.cvc ? styles.inputError : ""}`}
                  value={form.cvc}
                  onChange={(e) => setField("cvc", e.target.value)}
                />
                {errors.cvc && <span className={styles.errorText}>{errors.cvc}</span>}
              </div>
            </div>
          </div>
        </div>

        <div className={`card elev-sm ${styles.summary}`}>
          <h2 className="card-title">Order Summary</h2>
          {shipMethod === "standard" && standardShipping > 0 && (
            <div className={styles.shippingProgress}>
              <p className={styles.shippingProgressText}>
                Add <strong>{formatPrice(FREE_SHIPPING_THRESHOLD - subtotal)}</strong> more for free standard
                shipping
              </p>
              <div className={styles.shippingBar}>
                <div
                  className={styles.shippingBarFill}
                  style={{ width: `${Math.min(100, (subtotal / FREE_SHIPPING_THRESHOLD) * 100)}%` }}
                />
              </div>
            </div>
          )}
          <div className={styles.summaryItems}>
            {lines.map((l) => (
              <div key={`${l.productId}-${l.size}`} className={styles.summaryItemRow}>
                <span className="text-muted">
                  {l.product?.name} × {l.qty}
                </span>
                <span>{formatPrice((l.product?.price ?? 0) * l.qty)}</span>
              </div>
            ))}
          </div>
          <div className={styles.summaryRow}>
            <span className="text-muted">Subtotal</span>
            <span>{formatPrice(subtotal)}</span>
          </div>
          <div className={styles.summaryRow} style={{ borderTop: "none", paddingTop: 0 }}>
            <span className="text-muted">Shipping</span>
            <span>{shipping === 0 ? "Free" : formatPrice(shipping)}</span>
          </div>
          <div className={styles.summaryTotal}>
            <span>Total</span>
            <span>{formatPrice(total)}</span>
          </div>
          <button
            type="button"
            className="btn btn-primary btn-block"
            onClick={placeOrder}
            disabled={lines.length === 0 || submitting}
          >
            {submitting ? "Placing Order…" : "Place Order"}
          </button>
        </div>
      </section>
      <Footer />
    </>
  );
}
