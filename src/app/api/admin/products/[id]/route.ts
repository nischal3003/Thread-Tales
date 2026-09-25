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

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body: ProductInput = await req.json();

  const { error } = await supabaseService()
    .from("products")
    .update({
      slug: body.slug,
      name: body.name,
      category: body.category,
      price: body.price,
      is_new: body.isNew,
      tagline: body.tagline,
      description: body.description,
      care: body.care,
      images: body.images,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id);

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });

  const { error: delError } = await supabaseService().from("product_sizes").delete().eq("product_id", id);
  if (delError) return NextResponse.json({ error: delError.message }, { status: 400 });

  if (body.sizes?.length) {
    const { error: sizesError } = await supabaseService()
      .from("product_sizes")
      .insert(body.sizes.map((s) => ({ product_id: id, label: s.label, stock: s.stock })));
    if (sizesError) return NextResponse.json({ error: sizesError.message }, { status: 400 });
  }

  return NextResponse.json({ ok: true });
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { error } = await supabaseService().from("products").delete().eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ ok: true });
}
