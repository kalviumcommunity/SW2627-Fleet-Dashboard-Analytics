import { createBrowserClient } from "@supabase/ssr";

const DEFAULT_SUPABASE_URL = "https://eizzxjuelgullptljdrx.supabase.co";
const DEFAULT_SUPABASE_ANON_KEY = "sb_publishable_QreVZbOf3Ma6FoELS9TybQ_5ODYU8Y6";

export function createClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || DEFAULT_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || DEFAULT_SUPABASE_ANON_KEY;

  return createBrowserClient(url, key);
}