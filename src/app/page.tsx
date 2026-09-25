import SiteHeader from "@/components/SiteHeader";
import Footer from "@/components/Footer";
import NewsletterForm from "@/components/NewsletterForm";
import Reveal from "@/components/Reveal";
import Counter from "@/components/Counter";
import HeroImage from "@/components/HeroImage";
import ShopSection from "@/components/sections/ShopSection";
import EditorialSection from "@/components/sections/EditorialSection";
import { getProducts } from "@/lib/products";
import styles from "./page.module.css";

export const dynamic = "force-dynamic";

export default async function Home() {
  const products = await getProducts();

  return (
    <>
      <SiteHeader />

      <section id="hero" className={styles.hero}>
        <div className={styles.heroContent}>
          <span className="eyebrow">Chapter One — The Founding Edit</span>
          <h1 className={styles.heroHeading}>
            Every thread
            <br />
            carries a <em>tale.</em>
          </h1>
          <p className={`${styles.heroSub} text-muted`}>
            Thread&amp;Tales makes everyday ethnic wear from real craft — hand block-printed cottons, handloom
            weaves, and stitching worth knowing the name of.
          </p>
          <div className={styles.heroCtas}>
            <a href="#shop" className="btn btn-primary">
              Shop the Edit
            </a>
            <a href="/about" className="btn btn-ghost">
              Read Our Story →
            </a>
          </div>
          <div className={styles.heroTrust}>
            <span>{products.length} pieces, one collection</span>
            <span className={styles.heroTrustDot} aria-hidden="true" />
            <span>100% hand block-printed</span>
            <span className={styles.heroTrustDot} aria-hidden="true" />
            <span>Free shipping over ₹1,999</span>
          </div>
        </div>
        <div className={styles.heroImage}>
          <HeroImage src="/shoot/14.jpg" alt="Noir Block Print Halter Top, portrait" sticker="100% Hand Block-Printed" />
        </div>
      </section>

      <section className={styles.stats}>
        <Reveal className={styles.statsGrid}>
          <div>
            <span className={styles.statLabel}>Founded</span>
            <span className={styles.statValue}>
              <Counter to={2025} />
            </span>
          </div>
          <div>
            <span className={styles.statLabel}>Pieces this season</span>
            <span className={styles.statValue}>
              <Counter to={products.length} />
            </span>
          </div>
          <div>
            <span className={styles.statLabel}>Hand-finished</span>
            <span className={styles.statValue}>
              <Counter to={100} suffix="%" />
            </span>
          </div>
          <div>
            <span className={styles.statLabel}>Trend cycles chased</span>
            <span className={styles.statValue}>
              <Counter to={0} />
            </span>
          </div>
        </Reveal>
      </section>

      <ShopSection products={products} />

      <EditorialSection />

      <Reveal className={styles.quoteSection}>
        <div className={styles.quoteInner}>
          <div className={styles.quoteMark} aria-hidden="true">
            &ldquo;
          </div>
          <blockquote className={styles.blockquote}>
            I&apos;ve worn my Indigo Block Print Halter Top every week for a year. It still smells faintly like the
            block-printer&apos;s yard the day I picked it up.
          </blockquote>
          <figcaption className={styles.quoteCaption}>— R. Iyer, first edition customer</figcaption>
        </div>
      </Reveal>

      <Reveal className={styles.newsletter}>
        <div className={styles.newsletterInner}>
          <div>
            <h3>Join the mailing list</h3>
            <p>One dispatch a month — new arrivals, restocks, and the odd note from the studio. No noise.</p>
          </div>
          <NewsletterForm />
        </div>
      </Reveal>

      <Footer />
    </>
  );
}
