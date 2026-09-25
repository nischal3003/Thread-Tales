"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useCart } from "@/lib/cart-context";
import { useWishlist } from "@/lib/wishlist-context";
import { scrollToSection } from "@/lib/lenis-instance";
import styles from "./SiteNav.module.css";

const ANCHOR_LINKS = [{ id: "shop", label: "Shop" }];

export default function SiteNav() {
  const pathname = usePathname();
  const { count } = useCart();
  const { count: wishlistCount } = useWishlist();
  const onHome = pathname === "/";
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  function handleAnchorClick(e: React.MouseEvent, id: string) {
    setMenuOpen(false);
    if (onHome) {
      e.preventDefault();
      scrollToSection(id);
    }
    // otherwise let the Link navigate to "/#id" — SmoothScroll picks up the hash on load
  }

  return (
    <nav className={styles.nav}>
      <Link href="/#hero" className={styles.brand} onClick={(e) => handleAnchorClick(e, "hero")}>
        <Image src="/logo-mark.png" alt="" width={24} height={26} className={styles.mark} priority />
        Thread&amp;Tales
      </Link>

      <div className={styles.links}>
        {ANCHOR_LINKS.map((link) => (
          <Link key={link.id} href={`/#${link.id}`} onClick={(e) => handleAnchorClick(e, link.id)}>
            {link.label}
          </Link>
        ))}
        <Link href="/about" data-active={pathname.startsWith("/about")}>
          Stories
        </Link>
        <Link href="/login" data-active={pathname.startsWith("/login")}>
          Account
        </Link>
        <Link href="/wishlist" className={styles.bagLink} data-active={pathname.startsWith("/wishlist")}>
          Wishlist
          {wishlistCount > 0 && <span className={styles.badge}>{wishlistCount}</span>}
        </Link>
        <Link href="/cart" className={styles.bagLink} data-active={pathname.startsWith("/cart")}>
          Bag
          {count > 0 && <span className={styles.badge}>{count}</span>}
        </Link>
      </div>

      <div className={styles.mobileBar}>
        <Link href="/wishlist" className={styles.iconLink} aria-label="Wishlist">
          <svg viewBox="0 0 24 24" width="21" height="21" aria-hidden="true">
            <path
              d="M12 20.5s-7.5-4.6-10-9.3C.4 8 1.7 4.5 5 3.5c2.1-.6 4.2.3 5.3 2C11.5 3.8 13.6 2.9 15.7 3.5c3.3 1 4.6 4.5 3 7.7-2.5 4.7-10 9.3-10 9.3z"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinejoin="round"
            />
          </svg>
          {wishlistCount > 0 && <span className={styles.badge}>{wishlistCount}</span>}
        </Link>
        <Link href="/cart" className={styles.iconLink} aria-label="Bag">
          <svg viewBox="0 0 24 24" width="21" height="21" aria-hidden="true">
            <path
              d="M6 8h12l-1 13H7L6 8z"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinejoin="round"
            />
            <path d="M9 8V6a3 3 0 0 1 6 0v2" fill="none" stroke="currentColor" strokeWidth="1.8" />
          </svg>
          {count > 0 && <span className={styles.badge}>{count}</span>}
        </Link>
        <button
          type="button"
          className={styles.menuBtn}
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((v) => !v)}
        >
          <span data-open={menuOpen} />
        </button>
      </div>

      <div className={styles.drawer} data-open={menuOpen}>
        <Link href="/#hero" onClick={(e) => handleAnchorClick(e, "hero")}>
          Home
        </Link>
        {ANCHOR_LINKS.map((link) => (
          <Link key={link.id} href={`/#${link.id}`} onClick={(e) => handleAnchorClick(e, link.id)}>
            {link.label}
          </Link>
        ))}
        <Link href="/about" data-active={pathname.startsWith("/about")} onClick={() => setMenuOpen(false)}>
          Stories
        </Link>
        <Link href="/login" data-active={pathname.startsWith("/login")} onClick={() => setMenuOpen(false)}>
          Account
        </Link>
      </div>
      {menuOpen && <button type="button" className={styles.scrim} aria-label="Close menu" onClick={() => setMenuOpen(false)} />}
    </nav>
  );
}
