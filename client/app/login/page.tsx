import Link from "next/link";

export default function LoginPage() {
    return (
        <div style={{ padding: "20px", fontFamily: "sans-serif" }}>
            <h1>Login Page</h1>
            <p>Please enter your credentials to login.</p>
            <div style={{ marginTop: "16px" }}>
                <Link href="/" style={{ color: "#2563eb", textDecoration: "underline" }}>← Back to Home</Link>
            </div>
        </div>
    );
}