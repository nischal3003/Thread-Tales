import { NextResponse } from "next/server";
import { supabaseService } from "@/lib/supabase/service";

export async function GET() {
  const { data, error } = await supabaseService.storage.from("product-images").list("", {
    limit: 1000,
    sortBy: { column: "created_at", order: "desc" },
  });
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });

  const files = (data ?? [])
    .filter((f) => f.id)
    .map((f) => ({
      name: f.name,
      url: supabaseService.storage.from("product-images").getPublicUrl(f.name).data.publicUrl,
    }));

  return NextResponse.json(files);
}
