export default function DashboardLoading() {
  return (
    <main className="min-h-screen p-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <div className="h-8 w-48 animate-pulse rounded bg-gray-200" />
            <div className="mt-2 h-4 w-24 animate-pulse rounded bg-gray-200" />
          </div>
          <div className="h-9 w-24 animate-pulse rounded-lg bg-gray-200" />
        </div>

        <div className="mb-8 h-[500px] animate-pulse rounded-xl bg-gray-200" />

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="h-32 animate-pulse rounded-xl border bg-gray-100"
            />
          ))}
        </div>
      </div>
    </main>
  );
}
