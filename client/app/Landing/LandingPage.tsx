import Link from "next/link";

export default function LandingPage() {
  return (
    <main className="hero-section">
      <div className="hero-card">
        <h1 className="hero-title">Fleet Dashboard</h1>
        <p className="hero-subtitle">
          Monitor your fleet&apos;s vehicles, locations, and trip history in real time.
        </p>
        <div className="hero-actions">
          <Link href="/dashboard" className="btn btn-primary">
            Go to Dashboard
          </Link>
          <Link href="/login" className="btn btn-outline">
            Login
          </Link>
          <Link href="/signup" className="btn btn-outline">
            Sign Up
          </Link>
        </div>
      </div>
    </main>
  );
}