export function validateEnv() {
  const missing: string[] = [];

  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
    missing.push("NEXT_PUBLIC_SUPABASE_URL");
  }
  if (!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    missing.push("NEXT_PUBLIC_SUPABASE_ANON_KEY");
  }
  if (!process.env.NEXT_PUBLIC_MAPMYINDIA_API_KEY && !process.env.NEXT_PUBLIC_MAPPLS_KEY) {
    missing.push("NEXT_PUBLIC_MAPPLS_KEY or NEXT_PUBLIC_MAPMYINDIA_API_KEY");
  }

  if (missing.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missing.join(", ")}\n` +
        `Check your .env.local file and compare against .env.example.`
    );
  }
}