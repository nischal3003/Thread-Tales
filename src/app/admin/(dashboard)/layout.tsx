import Link from "next/link";
import LogoutButton from "./LogoutButton";
import styles from "./admin.module.css";

export default function AdminDashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className={styles.shell}>
      <nav className={styles.nav}>
        <Link href="/admin" className={styles.brand}>
          Thread&amp;Tales Admin
        </Link>
        <div className={styles.links}>
          <Link href="/admin">Products</Link>
          <Link href="/admin/products/new">+ New Product</Link>
          <LogoutButton />
        </div>
      </nav>
      <main className={styles.main}>{children}</main>
    </div>
  );
}
