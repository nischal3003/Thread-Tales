import styles from "./ImageSlot.module.css";

export default function ImageSlot({ label }: { label: string }) {
  return (
    <div className={styles.slot}>
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <rect x="2" y="4" width="20" height="16" rx="1.5" stroke="currentColor" strokeWidth="1.4" />
        <circle cx="8" cy="10" r="1.6" stroke="currentColor" strokeWidth="1.4" />
        <path d="M3 17l5.5-5 4 4 3-3 5.5 6" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      <span className={styles.label}>{label}</span>
    </div>
  );
}
