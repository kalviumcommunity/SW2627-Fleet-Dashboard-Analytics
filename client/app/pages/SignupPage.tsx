import Link from "next/link";

export default function SignupPage() {
    return (
        <div style={{ padding: "20px", fontFamily: "sans-serif" }}>
            <h1>Sign Up Page</h1>
            <p>Create a new account.</p>
            <div style={{ marginTop: "16px" }}>
                <Link href="/" style={{ color: "#2563eb", textDecoration: "underline" }}>← Back to Home</Link>
            </div>
        </div>
    );
}