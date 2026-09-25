import "server-only";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";

// Service-role client: bypasses row-level security. Never import this
// file from a "use client" component — it holds the secret key.
// Created lazily (not at module scope) so a missing env var doesn't
// crash Next.js's build-time route analysis — only actual requests fail.
let client: SupabaseClient | null = null;

export function supabaseService() {
  if (!client) {
    client = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      { auth: { persistSession: false } },
    );
  }
  return client;
}
