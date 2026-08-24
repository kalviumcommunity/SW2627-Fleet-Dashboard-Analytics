import Link from "next/link";

export default function Dashboard() {
    return (
        <div style={{ padding: "20px", fontFamily: "sans-serif" }}>
            <h1>Fleet Dashboard</h1>
            <p>Overview of your fleet metrics and analytics.</p>
            <div style={{ marginTop: "16px" }}>
                <Link href="/" style={{ color: "#2563eb", textDecoration: "underline" }}>← Back to Home</Link>
            </div>
        </div>
    );
}