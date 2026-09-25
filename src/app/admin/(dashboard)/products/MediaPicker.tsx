"use client";

import { useEffect, useState } from "react";
import styles from "../admin.module.css";

type MediaFile = { name: string; url: string };

export default function MediaPicker({
  onSelect,
  selected,
}: {
  onSelect: (urls: string[]) => void;
  selected: string[];
}) {
  const [open, setOpen] = useState(false);
  const [files, setFiles] = useState<MediaFile[] | null>(null);
  const [picked, setPicked] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (!open || files) return;
    fetch("/api/admin/media")
      .then((r) => r.json())
      .then(setFiles)
      .catch(() => setFiles([]));
  }, [open, files]);

  function toggle(url: string) {
    setPicked((prev) => {
      const next = new Set(prev);
      if (next.has(url)) next.delete(url);
      else next.add(url);
      return next;
    });
  }

  function confirm() {
    onSelect(Array.from(picked));
    setPicked(new Set());
    setOpen(false);
  }

  if (!open) {
    return (
      <button type="button" className="btn btn-outline" onClick={() => setOpen(true)}>
        Choose from uploaded photos
      </button>
    );
  }

  return (
    <div className={styles.mediaPicker}>
      <div className={styles.mediaPickerHeader}>
        <span>{files ? `${files.length} photos already uploaded` : "Loading…"}</span>
        <button type="button" className={styles.deleteBtn} onClick={() => setOpen(false)}>
          Close
        </button>
      </div>
      <div className={styles.mediaGrid}>
        {files?.map((f) => {
          const isPicked = picked.has(f.url);
          const alreadyUsed = selected.includes(f.url);
          return (
            <button
              type="button"
              key={f.url}
              className={styles.mediaThumb}
              data-picked={isPicked}
              data-used={alreadyUsed}
              onClick={() => !alreadyUsed && toggle(f.url)}
              disabled={alreadyUsed}
              title={alreadyUsed ? "Already added to this product" : f.name}
            >
              <img src={f.url} alt="" />
            </button>
          );
        })}
      </div>
      <div className={styles.actionsRow}>
        <button type="button" className="btn btn-primary" onClick={confirm} disabled={picked.size === 0}>
          Add {picked.size > 0 ? picked.size : ""} photo{picked.size === 1 ? "" : "s"}
        </button>
      </div>
    </div>
  );
}
