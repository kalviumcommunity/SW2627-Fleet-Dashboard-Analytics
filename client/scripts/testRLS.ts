
import { createClient } from "@supabase/supabase-js";
import * as dotenv from "dotenv";
 
dotenv.config({ path: ".env.local" });
 
const SUPABASE_URL = process.env.Project_URL || process.env.NEXT_PUBLIC_SUPABASE_URL as string;
const ANON_KEY = process.env.anon_public_key || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string;
 
const TEST_EMAIL = "shyam.sharma.s.124@kalvium.community"; 
const TEST_PASSWORD = "shyamsharma"; 
 
if (!SUPABASE_URL || !ANON_KEY) {
  throw new Error("Missing Project_URL (or NEXT_PUBLIC_SUPABASE_URL) or anon_public_key (or NEXT_PUBLIC_SUPABASE_ANON_KEY) in .env.local");
}
 
async function testAnonymousRead() {
  console.log("\n--- TEST 1: Anonymous (logged-out) read ---");
  const supabase = createClient(SUPABASE_URL, ANON_KEY);
 
  const { data: vehicles, error: vErr } = await supabase.from("vehicles").select("*");
  const { data: trips, error: tErr } = await supabase.from("trips").select("*");
 
  console.log("vehicles ->", vehicles?.length ?? 0, "rows", vErr ? `(error: ${vErr.message})` : "");
  console.log("trips    ->", trips?.length ?? 0, "rows", tErr ? `(error: ${tErr.message})` : "");
 
  if ((vehicles?.length ?? 0) === 0 && (trips?.length ?? 0) === 0) {
    console.log("✅ PASS: anonymous users cannot read data (RLS is blocking as expected).");
  } else {
    console.log("❌ FAIL: anonymous users CAN read data — policy is too open, needs fixing.");
  }
}
 
async function testAuthenticatedRead() {
  console.log("\n--- TEST 2: Authenticated (logged-in) read ---");
  const supabase = createClient(SUPABASE_URL, ANON_KEY);
 
  const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
    email: TEST_EMAIL,
    password: TEST_PASSWORD,
  });
 
  if (signInError) {
    console.error("❌ Could not sign in test user:", signInError.message);
    console.error("   Make sure the test user exists and the email/password above are correct.");
    return;
  }
 
  console.log("Signed in as:", signInData.user?.email);
 
  const { data: vehicles, error: vErr } = await supabase.from("vehicles").select("*");
  const { data: trips, error: tErr } = await supabase.from("trips").select("*");
 
  console.log("vehicles ->", vehicles?.length ?? 0, "rows", vErr ? `(error: ${vErr.message})` : "");
  console.log("trips    ->", trips?.length ?? 0, "rows", tErr ? `(error: ${tErr.message})` : "");
 
  if ((vehicles?.length ?? 0) > 0 && (trips?.length ?? 0) > 0) {
    console.log("✅ PASS: authenticated user can read data as expected.");
  } else {
    console.log("❌ FAIL: authenticated user could NOT read data — check the RLS policy's role/command settings.");
  }
 
  await supabase.auth.signOut();
}
 
async function main() {
  await testAnonymousRead();
  await testAuthenticatedRead();
}
 
main();