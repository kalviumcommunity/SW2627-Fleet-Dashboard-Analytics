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
    const message =
      `[Fleet Dashboard Warning] Missing environment variables: ${missing.join(", ")}\n` +
      `Ensure these variables are configured in your Render dashboard or .env file for full Supabase and Map functionality.`;

    console.warn(message);
  }
}