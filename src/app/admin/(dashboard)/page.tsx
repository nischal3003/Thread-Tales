import Link from "next/link";
import { getProducts, formatPrice, totalStock } from "@/lib/products";
import styles from "./admin.module.css";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const products = await getProducts();

  return (
    <div>
      <h1>Products ({products.length})</h1>
      <table className={styles.table}>
        <thead>
          <tr>
            <th></th>
            <th>Name</th>
            <th>Category</th>
            <th>Price</th>
            <th>Stock</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {products.map((p) => {
            const stock = totalStock(p);
            return (
              <tr key={p.id}>
                <td>
                  {p.images[0] && <img src={p.images[0]} alt="" className={styles.thumb} />}
                </td>
                <td>{p.name}</td>
                <td>{p.category}</td>
                <td>{formatPrice(p.price)}</td>
                <td>
                  <span className={`${styles.stockBadge} ${stock === 0 ? styles.stockOut : ""}`}>
                    {stock === 0 ? "Sold out" : `${stock} in stock`}
                  </span>
                </td>
                <td>
                  <div className={styles.rowActions}>
                    <Link href={`/admin/products/${p.id}/edit`}>Edit</Link>
                    <Link href={`/product/${p.slug}`} target="_blank">
                      View
                    </Link>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
