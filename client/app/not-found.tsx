import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center p-8">
      <div className="text-center">
        <p className="text-sm font-medium text-gray-500">404</p>
        <h1 className="mt-2 text-3xl font-bold">Page not found</h1>
        <p className="mt-2 text-gray-500">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <Link
          href="/dashboard"
          className="mt-6 inline-block rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
        >
          Back to Dashboard
        </Link>
      </div>
    </main>
  );
}