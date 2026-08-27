"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import styles from "./signup.module.css";

export default function SignupPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setMessage(null);
    setLoading(true);

    const supabase = createClient();
    const { error } = await supabase.auth.signUp({
      email,
      password,
    });

    setLoading(false);

    if (error) {
      setError(error.message);
      return;
    }

    setMessage("Check your email to confirm your account before signing in.");
  }

  return (
    <main className={styles.page}>
      <div className={styles.card}>
        <h1 className={styles.title}>Create an account</h1>
        <p className={styles.subtitle}>Get started with the Fleet Dashboard.</p>

        <form onSubmit={handleSignup} className={styles.form}>
          <div>
            <label className={styles.label}>Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={styles.input}
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label className={styles.label}>Password</label>
            <input
              type="password"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={styles.input}
              placeholder="At least 6 characters"
            />
          </div>

          {error && <p className={styles.errorMessage}>{error}</p>}

          {message && <p className={styles.successMessage}>{message}</p>}

          <button type="submit" disabled={loading} className={styles.submitButton}>
            {loading ? "Creating account..." : "Sign up"}
          </button>
        </form>

        <p className={styles.footerText}>
          Already have an account?{" "}
          <Link href="/login" className={styles.footerLink}>
            Sign in
          </Link>
        </p>
      </div>
    </main>
  );
}