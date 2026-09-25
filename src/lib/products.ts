import { createClient, type SupabaseClient } from "@supabase/supabase-js";

// Created lazily (not at module scope) so a missing env var doesn't
// crash Next.js's build-time route analysis — only actual requests fail.
let client: SupabaseClient | null = null;

function supabase() {
  if (!client) {
    client = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    );
  }
  return client;
}

export type ProductSize = { label: string; stock: number };

export type Product = {
  id: string;
  slug: string;
  name: string;
  category: string;
  price: number;
  isNew: boolean;
  tagline: string;
  desc: string;
  care: string;
  sizes: ProductSize[];
  images: string[];
};

type ProductRow = {
  id: string;
  slug: string;
  name: string;
  category: string;
  price: number;
  is_new: boolean;
  tagline: string;
  description: string;
  care: string;
  images: string[];
  product_sizes: { label: string; stock: number }[];
};

function mapRow(row: ProductRow): Product {
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    category: row.category,
    price: row.price,
    isNew: row.is_new,
    tagline: row.tagline,
    desc: row.description,
    care: row.care,
    images: row.images ?? [],
    sizes: row.product_sizes ?? [],
  };
}

const SELECT = "*, product_sizes(label, stock)";

export async function getProducts(): Promise<Product[]> {
  const { data, error } = await supabase()
    .from("products")
    .select(SELECT)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data as unknown as ProductRow[]).map(mapRow);
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  const { data, error } = await supabase()
    .from("products")
    .select(SELECT)
    .eq("slug", slug)
    .maybeSingle();
  if (error) throw error;
  return data ? mapRow(data as unknown as ProductRow) : null;
}

export async function getProductById(id: string): Promise<Product | null> {
  const { data, error } = await supabase()
    .from("products")
    .select(SELECT)
    .eq("id", id)
    .maybeSingle();
  if (error) throw error;
  return data ? mapRow(data as unknown as ProductRow) : null;
}

export async function relatedProducts(slug: string, count = 4): Promise<Product[]> {
  const all = await getProducts();
  const current = all.find((p) => p.slug === slug);
  const others = all.filter((p) => p.slug !== slug);
  if (!current) return others.slice(0, count);

  const sameCategory = others.filter((p) => p.category === current.category);
  const rest = others.filter((p) => p.category !== current.category);
  return [...sameCategory, ...rest].slice(0, count);
}

export function formatPrice(n: number): string {
  return "₹" + n.toLocaleString("en-IN");
}

export function totalStock(product: Product): number {
  return product.sizes.reduce((s, sz) => s + sz.stock, 0);
}

export const FREE_SHIPPING_THRESHOLD = 1999;
export const STANDARD_SHIPPING = 79;
export const EXPRESS_SHIPPING = 149;
