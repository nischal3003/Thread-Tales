import Link from "next/link";
import styles from "./Footer.module.css";

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.top}>
        <p className={styles.wordmark}>Thread&amp;Tales</p>
        <div className={styles.cols}>
          <div className={styles.col}>
            <span className={styles.colTitle}>Shop</span>
            <Link href="/#shop">The Edit</Link>
            <Link href="/cart">Bag</Link>
            <Link href="/login">Account</Link>
          </div>
          <div className={styles.col}>
            <span className={styles.colTitle}>Studio</span>
            <Link href="/about">Stories</Link>
            <span>hello@threadandtales.in</span>
          </div>
          <div className={styles.col}>
            <span className={styles.colTitle}>Follow</span>
            <a href="https://www.instagram.com/threadntales.in" target="_blank" rel="noopener noreferrer">
              Instagram
            </a>
          </div>
        </div>
      </div>
      <div className={styles.bottom}>
        <span>© 2026 Thread&amp;Tales</span>
        <span>Every thread carries a tale.</span>
      </div>
    </footer>
  );
}
