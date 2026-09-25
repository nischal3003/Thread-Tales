"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
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

  function handleAnchorClick(e: React.MouseEvent, id: string) {
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
    </nav>
  );
}
