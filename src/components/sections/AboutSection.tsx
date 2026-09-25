import Image from "next/image";
import Reveal from "@/components/Reveal";
import styles from "@/app/about/About.module.css";

export default function AboutSection() {
  return (
    <div>
      <section className={styles.hero}>
        <span className="eyebrow">Our Story</span>
        <h1>
          Threads worth
          <br />
          telling again.
        </h1>
      </section>

      <Reveal className={styles.split}>
        <div>
          <p className="text-muted">
            Thread&amp;Tales began with a single notebook and a question: what if clothes were written, not just
            manufactured? Every piece we make starts as a story — a person, a place, a morning — before it ever
            becomes a pattern.
          </p>
          <p className="text-muted">
            We work in small runs with block-printers and handloom weavers we know by name, favour natural fibres,
            and finish every garment by hand. The result is clothing meant to be worn for years, not seasons — the
            kind of piece that earns its own chapter in your closet.
          </p>
        </div>
        <div className={styles.founderImage}>
          <Image
            src="/shoot/15.jpg"
            alt="The Thread&Tales team on a shoot day"
            fill
            sizes="(max-width: 900px) 100vw, 42vw"
            style={{ objectFit: "cover" }}
          />
        </div>
      </Reveal>

      <section className={styles.values}>
        <Reveal className={styles.valuesInner}>
          <span className="eyebrow">What We Stand For</span>
          <div className={styles.valuesGrid}>
            <div>
              <h3>Craftsmanship</h3>
              <p>
                Every seam is finished by hand, every fit tested on real bodies before it&apos;s approved for the
                collection.
              </p>
            </div>
            <div>
              <h3>Honesty</h3>
              <p>
                We name our printers and weavers, publish our pricing logic, and never chase a trend we don&apos;t
                believe in.
              </p>
            </div>
            <div>
              <h3>Longevity</h3>
              <p>Fewer, better pieces — designed to be repaired, re-worn, and eventually handed down.</p>
            </div>
          </div>
        </Reveal>
      </section>

      <Reveal className={styles.quote}>
        <blockquote>
          &ldquo;We didn&apos;t want to build another wardrobe of things you forget you own. We wanted to build
          things you reach for on the days that matter.&rdquo;
        </blockquote>
        <figcaption>— Founder, Thread&amp;Tales</figcaption>
      </Reveal>

      <section className={styles.cta}>
        <a href="/#shop" className="btn btn-primary">
          Shop the Edit
        </a>
      </section>
    </div>
  );
}
