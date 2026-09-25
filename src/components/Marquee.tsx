import styles from "./Marquee.module.css";

export default function Marquee({ items }: { items: string[] }) {
  const group = (
    <span className={styles.group}>
      {items.map((text, i) => (
        <span key={i} className={styles.item}>
          <span className={styles.dot} />
          {text}
        </span>
      ))}
    </span>
  );

  return (
    <div className={styles.marquee} aria-hidden="true">
      <div className={styles.track}>
        {group}
        {group}
      </div>
    </div>
  );
}
