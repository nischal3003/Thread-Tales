"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { Product } from "@/lib/products";
import MediaPicker from "./MediaPicker";
import styles from "../admin.module.css";

function slugify(s: string) {
  return s
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export default function ProductForm({ product }: { product?: Product }) {
  const router = useRouter();
  const isEdit = Boolean(product);

  const [name, setName] = useState(product?.name ?? "");
  const [slug, setSlug] = useState(product?.slug ?? "");
  const [slugTouched, setSlugTouched] = useState(isEdit);
  const [category, setCategory] = useState(product?.category ?? "");
  const [price, setPrice] = useState(String(product?.price ?? ""));
  const [isNew, setIsNew] = useState(product?.isNew ?? false);
  const [tagline, setTagline] = useState(product?.tagline ?? "");
  const [description, setDescription] = useState(product?.desc ?? "");
  const [care, setCare] = useState(product?.care ?? "");
  const [sizes, setSizes] = useState(product?.sizes?.length ? product.sizes : [{ label: "S", stock: 0 }]);
  const [images, setImages] = useState<string[]>(product?.images ?? []);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  function handleNameChange(v: string) {
    setName(v);
    if (!slugTouched) setSlug(slugify(v));
  }

  async function handleFiles(fileList: FileList | null) {
    if (!fileList || fileList.length === 0) return;
    setUploading(true);
    setError("");
    try {
      for (const file of Array.from(fileList)) {
        const form = new FormData();
        form.append("file", file);
        const res = await fetch("/api/admin/upload", { method: "POST", body: form });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Upload failed");
        setImages((prev) => [...prev, data.url]);
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  }

  function updateSize(index: number, patch: Partial<{ label: string; stock: number }>) {
    setSizes((prev) => prev.map((s, i) => (i === index ? { ...s, ...patch } : s)));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");

    const payload = {
      slug,
      name,
      category,
      price: Number(price),
      isNew,
      tagline,
      description,
      care,
      images,
      sizes: sizes.filter((s) => s.label.trim()),
    };

    const res = await fetch(isEdit ? `/api/admin/products/${product!.id}` : "/api/admin/products", {
      method: isEdit ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    setSaving(false);
    if (res.ok) {
      router.push("/admin");
      router.refresh();
    } else {
      const data = await res.json().catch(() => ({}));
      setError(data.error || "Something went wrong");
    }
  }

  async function handleDelete() {
    if (!product) return;
    if (!window.confirm(`Delete "${product.name}"? This can't be undone.`)) return;
    const res = await fetch(`/api/admin/products/${product.id}`, { method: "DELETE" });
    if (res.ok) {
      router.push("/admin");
      router.refresh();
    }
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <div className="field">
        <label>Name</label>
        <input className="input" value={name} onChange={(e) => handleNameChange(e.target.value)} required />
      </div>

      <div className="field">
        <label>Slug (URL)</label>
        <input
          className="input"
          value={slug}
          onChange={(e) => {
            setSlugTouched(true);
            setSlug(e.target.value);
          }}
          required
        />
      </div>

      <div className={styles.row2}>
        <div className="field">
          <label>Category</label>
          <input className="input" value={category} onChange={(e) => setCategory(e.target.value)} required />
        </div>
        <div className="field">
          <label>Price (₹)</label>
          <input
            className="input"
            type="number"
            min="0"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
          />
        </div>
      </div>

      <label className="radio">
        <input type="checkbox" checked={isNew} onChange={(e) => setIsNew(e.target.checked)} style={{ position: "static", width: "auto", height: "auto", opacity: 1 }} />
        Mark as &quot;New&quot;
      </label>

      <div className="field">
        <label>Tagline</label>
        <input className="input" value={tagline} onChange={(e) => setTagline(e.target.value)} />
      </div>

      <div className="field">
        <label>Description</label>
        <textarea className="input" rows={4} value={description} onChange={(e) => setDescription(e.target.value)} />
      </div>

      <div className="field">
        <label>Fabric &amp; Care</label>
        <textarea className="input" rows={2} value={care} onChange={(e) => setCare(e.target.value)} />
      </div>

      <div className="field">
        <label>Sizes &amp; Stock</label>
        <div className={styles.sizesBlock}>
          {sizes.map((s, i) => (
            <div key={i} className={styles.sizeRow}>
              <input
                className="input"
                placeholder="Size label (e.g. M)"
                value={s.label}
                onChange={(e) => updateSize(i, { label: e.target.value })}
              />
              <input
                className="input"
                type="number"
                min="0"
                placeholder="Stock"
                value={s.stock}
                onChange={(e) => updateSize(i, { stock: Number(e.target.value) })}
              />
              <button type="button" className={styles.deleteBtn} onClick={() => setSizes((prev) => prev.filter((_, idx) => idx !== i))}>
                Remove
              </button>
            </div>
          ))}
          <button
            type="button"
            className="btn btn-outline"
            style={{ alignSelf: "flex-start" }}
            onClick={() => setSizes((prev) => [...prev, { label: "", stock: 0 }])}
          >
            + Add size
          </button>
        </div>
      </div>

      <div className="field">
        <label>Photos</label>
        <input type="file" accept="image/*" multiple onChange={(e) => handleFiles(e.target.files)} disabled={uploading} />
        {uploading && <p className="text-muted">Uploading…</p>}
        <div style={{ marginTop: 12 }}>
          <MediaPicker
            selected={images}
            onSelect={(urls) => setImages((prev) => [...prev, ...urls.filter((u) => !prev.includes(u))])}
          />
        </div>
        <div className={styles.imagesBlock} style={{ marginTop: 12 }}>
          {images.map((src, i) => (
            <div key={src} className={styles.imagePreview}>
              <img src={src} alt="" />
              <button type="button" className={styles.removeImage} onClick={() => setImages((prev) => prev.filter((_, idx) => idx !== i))}>
                ×
              </button>
            </div>
          ))}
        </div>
      </div>

      {error && <p className={styles.formError}>{error}</p>}

      <div className={styles.actionsRow}>
        <button type="submit" className="btn btn-primary" disabled={saving || uploading}>
          {saving ? "Saving…" : isEdit ? "Save Changes" : "Create Product"}
        </button>
        {isEdit && (
          <button type="button" className={styles.deleteBtn} onClick={handleDelete}>
            Delete Product
          </button>
        )}
      </div>
    </form>
  );
}
