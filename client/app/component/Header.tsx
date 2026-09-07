import Link from "next/link";

export default function Header() {
  return (
    <header className="header">
      <div className="header-brand">
        <Link href="/">FleetPulse</Link>
      </div>
      <nav className="header-nav">
        <Link href="/login" className="header-link">Login</Link>
        <Link href="/signup" className="header-link">Sign Up</Link>
        <Link href="/dashboard" className="header-link">Dashboard</Link>
      </nav>
    </header>
  );
}