import "server-only";
import { createClient } from "@supabase/supabase-js";
import type { Database } from "./types";

export function createServerClient() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !key) {
    throw new Error("Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY env vars");
  }

  return createClient<Database>(url, key, {
    auth: { persistSession: false },
  });
}
