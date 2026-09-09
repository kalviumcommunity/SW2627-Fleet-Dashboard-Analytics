import { createClient, SupabaseClient } from "@supabase/supabase-js";

let serviceClient: SupabaseClient | null = null;

/**
 * Returns a server-side Supabase client for API routes.
 * Prefers SERVICE_ROLE_KEY for administrative operations (bypassing RLS),
 * and falls back to NEXT_PUBLIC_SUPABASE_ANON_KEY.
 */
export function getServiceClient(): SupabaseClient | null {
  const DEFAULT_SUPABASE_URL = "https://eizzxjuelgullptljdrx.supabase.co";
  const DEFAULT_SUPABASE_ANON_KEY = "sb_publishable_QreVZbOf3Ma6FoELS9TybQ_5ODYU8Y6";

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || DEFAULT_SUPABASE_URL;
  const key =
    process.env.SERVICE_ROLE_KEY ||
    process.env.service_role_key ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    DEFAULT_SUPABASE_ANON_KEY;

  if (!serviceClient) {
    serviceClient = createClient(url, key, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    });
  }

  return serviceClient;
}
