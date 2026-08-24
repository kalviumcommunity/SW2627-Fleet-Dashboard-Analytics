import Link from "next/link";

export default function LandingPage() {
    return (
        <div style={{ padding: "20px", fontFamily: "sans-serif" }}>
            <h1>Fleet Dashboard</h1>
            <p>Welcome to the Fleet Dashboard</p>
            <nav style={{ display: "flex", gap: "12px", marginTop: "16px" }}>
                <Link href="/login" style={{ color: "#2563eb", textDecoration: "underline" }}>Login</Link>
                <Link href="/signup" style={{ color: "#2563eb", textDecoration: "underline" }}>Sign Up</Link>
                <Link href="/dashboard" style={{ color: "#2563eb", textDecoration: "underline" }}>Dashboard</Link>
            </nav>
        </div>
    );
}