"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import "./reset-password.css";

export default function ResetPasswordPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  async function handleUpdate(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    const supabase = createClient();
    const { error } = await supabase.auth.updateUser({ password });

    if (error) {
      setError(error.message);
      return;
    }

    setSuccess(true);
    setTimeout(() => router.push("/login"), 2000);
  }

  return (
    <main className="page">
      <div className="card">
        <h1 className="title">Set a new password</h1>

        <form onSubmit={handleUpdate} className="form">
          <div>
            <label className="label">New password</label>
            <input
              type="password"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input"
              placeholder="At least 6 characters"
            />
          </div>

          {error && <p className="errorMessage">{error}</p>}
          {success && (
            <p className="successMessage">
              Password updated. Redirecting to login...
            </p>
          )}

          <button type="submit" className="submitButton">
            Update password
          </button>
        </form>
      </div>
    </main>
  );
}