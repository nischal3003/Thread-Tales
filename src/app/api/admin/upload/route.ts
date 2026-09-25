import { NextRequest, NextResponse } from "next/server";
import { supabaseService } from "@/lib/supabase/service";

export async function POST(req: NextRequest) {
  const form = await req.formData();
  const file = form.get("file");

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "No file provided" }, { status: 400 });
  }

  const ext = file.name.split(".").pop() || "jpg";
  const path = `${crypto.randomUUID()}.${ext}`;

  const { error } = await supabaseService().storage
    .from("product-images")
    .upload(path, await file.arrayBuffer(), { contentType: file.type, upsert: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });

  const { data } = supabaseService().storage.from("product-images").getPublicUrl(path);
  return NextResponse.json({ url: data.publicUrl });
}
