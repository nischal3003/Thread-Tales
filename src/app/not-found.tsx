import Link from "next/link";
import SiteHeader from "@/components/SiteHeader";
import Footer from "@/components/Footer";
import styles from "./not-found.module.css";

export default function NotFound() {
  return (
    <>
      <SiteHeader />
      <section className={styles.section}>
        <span className={styles.code}>404</span>
        <h1>This chapter hasn&apos;t been written.</h1>
        <p className="text-muted">The page you&apos;re looking for doesn&apos;t exist, or has moved.</p>
        <div className={styles.actions}>
          <Link href="/" className="btn btn-primary">
            Back to Home
          </Link>
          <Link href="/#shop" className="btn btn-ghost">
            Shop the Edit →
          </Link>
        </div>
      </section>
      <Footer />
    </>
  );
}
