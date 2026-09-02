"use client";

import { useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import "./forgot-password.css";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleReset(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setMessage(null);
    setLoading(true);

    const supabase = createClient();
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });

    setLoading(false);

    if (error) {
      setError(error.message);
      return;
    }

    setMessage("Check your email for a password reset link.");
  }

  return (
    <main className="page">
      <div className="card">
        <h1 className="title">Reset your password</h1>
        <p className="subtitle">
          Enter your email and we&apos;ll send you a reset link.
        </p>

        <form onSubmit={handleReset} className="form">
          <div>
            <label className="label">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input"
              placeholder="you@example.com"
            />
          </div>

          {error && <p className="errorMessage">{error}</p>}
          {message && <p className="successMessage">{message}</p>}

          <button type="submit" disabled={loading} className="submitButton">
            {loading ? "Sending..." : "Send reset link"}
          </button>
        </form>

        <p className="footerText">
          <Link href="/login" className="footerLink">
            Back to sign in
          </Link>
        </p>
      </div>
    </main>
  );
}