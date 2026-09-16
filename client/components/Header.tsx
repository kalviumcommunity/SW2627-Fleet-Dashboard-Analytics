import Link from 'next/link';
import ThemeToggle from './ThemeToggle';

export default function Header() {
  return (
    <header
      className="header"
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '1rem 2rem',
        borderBottom: '1px solid #e0e0e0',
      }}
    >
      <div className="header-brand" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <h1 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 700 }}>
          <Link href="/" style={{ color: 'var(--primary, #1e40af)', textDecoration: 'none' }}>
            FleetPulse
          </Link>
        </h1>
      </div>
      <nav className="header-nav" style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
        <Link href="/login" className="header-link">
          Login
        </Link>
        <Link href="/signup" className="header-link">
          Sign Up
        </Link>
        <Link href="/dashboard" className="header-link">
          Dashboard
        </Link>
        {/* Use the Client Component leaf here */}
        <ThemeToggle />
      </nav>
    </header>
  );
}
