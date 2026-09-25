import { NextRequest, NextResponse } from "next/server";
import { supabaseService } from "@/lib/supabase/service";

type ProductInput = {
  slug: string;
  name: string;
  category: string;
  price: number;
  isNew: boolean;
  tagline: string;
  description: string;
  care: string;
  images: string[];
  sizes: { label: string; stock: number }[];
};

export async function POST(req: NextRequest) {
  const body: ProductInput = await req.json();

  if (!body.slug || !body.name || !body.category || !body.price) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  const { data: product, error } = await supabaseService()
    .from("products")
    .insert({
      slug: body.slug,
      name: body.name,
      category: body.category,
      price: body.price,
      is_new: body.isNew,
      tagline: body.tagline,
      description: body.description,
      care: body.care,
      images: body.images,
    })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });

  if (body.sizes?.length) {
    const { error: sizesError } = await supabaseService()
      .from("product_sizes")
      .insert(body.sizes.map((s) => ({ product_id: product.id, label: s.label, stock: s.stock })));
    if (sizesError) return NextResponse.json({ error: sizesError.message }, { status: 400 });
  }

  return NextResponse.json({ ok: true, id: product.id });
}
