"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import "./login.css";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleLogin(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    setError(null);
    setLoading(true);

    try {
      const supabase = createClient();

      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setError(error.message);
        return;
      }

      router.push("/dashboard");
      router.refresh();
    } catch (err) {
      setError("Something went wrong. Please try again.");
      console.error("Login error:", err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="page">
      <div className="card">
        <h1 className="title">Sign in</h1>

        <p className="subtitle">
          Welcome back to the Fleet Dashboard.
        </p>

        <form onSubmit={handleLogin} className="form">
          <div>
            <label htmlFor="email" className="label">
              Email
            </label>

            <input
              id="email"
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label htmlFor="password" className="label">
              Password
            </label>

            <input
              id="password"
              type="password"
              required
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input"
              placeholder="••••••••"
            />

            <div className="forgotPasswordRow">
              <Link href="/forgot-password" className="link">
                Forgot password?
              </Link>
            </div>
          </div>

          {error && (
            <p className="errorMessage" role="alert">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="submitButton"
          >
            {loading ? "Signing in..." : "Sign in"}
          </button>
        </form>

        <div className="divider">
          <div className="dividerLine" />
          <span className="dividerText">or</span>
          <div className="dividerLine" />
        </div>

        <button
          type="button"
          disabled
          className="oauthButton"
          title="OAuth provider setup pending"
        >
          Continue with Google
        </button>

        <p className="footerText">
          Don&apos;t have an account?{" "}
          <Link href="/signup" className="link">
            Sign up
          </Link>
        </p>
      </div>
    </main>
  );
}