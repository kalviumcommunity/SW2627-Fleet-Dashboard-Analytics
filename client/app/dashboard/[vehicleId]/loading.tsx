export default function Loading() {
  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6 lg:px-8">
      {/* Back button placeholder */}
      <div className="mb-6 h-5 w-36 animate-pulse rounded bg-gray-200" />

      {/* Vehicle heading */}
      <div className="mb-6">
        <div className="h-8 w-48 animate-pulse rounded bg-gray-200 sm:h-9" />
      </div>

      {/* Map skeleton */}
      <div className="mb-8 h-[240px] w-full animate-pulse rounded-lg bg-gray-200 sm:h-[300px]" />

      {/* Vehicle details skeleton */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div>
          <div className="mb-2 h-4 w-20 animate-pulse rounded bg-gray-200" />
          <div className="h-5 w-32 animate-pulse rounded bg-gray-200" />
        </div>

        <div>
          <div className="mb-2 h-4 w-32 animate-pulse rounded bg-gray-200" />
          <div className="h-5 w-40 animate-pulse rounded bg-gray-200" />
        </div>

        <div>
          <div className="mb-2 h-4 w-16 animate-pulse rounded bg-gray-200" />
          <div className="h-5 w-24 animate-pulse rounded bg-gray-200" />
        </div>

        <div>
          <div className="mb-2 h-4 w-36 animate-pulse rounded bg-gray-200" />
          <div className="h-5 w-48 animate-pulse rounded bg-gray-200" />
        </div>
      </div>

      {/* Trip History */}
      <section className="mt-8">
        <div className="mb-4">
          <div className="h-8 w-40 animate-pulse rounded bg-gray-200" />

          <div className="mt-2 h-4 w-24 animate-pulse rounded bg-gray-200" />
        </div>

        {/* Loading message */}
        <div
          className="rounded-lg border border-gray-200 p-8 text-center"
          role="status"
          aria-live="polite"
        >
          <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-gray-300 border-t-gray-700" />

          <p className="mt-4 font-medium text-gray-700">
            Loading trips...
          </p>

          <span className="sr-only">
            Please wait while trip history is loading.
          </span>
        </div>
      </section>
    </main>
  );
}