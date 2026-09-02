export default function StatusBadge({ status }: { status: string }) {
  const colors: Record<string, string> = {
    active: "bg-green-100 text-green-700",
    idle: "bg-yellow-100 text-yellow-700",
    offline: "bg-gray-200 text-gray-600",
  };

  return (
    <span
      className={`rounded-full px-3 py-1 text-xs font-medium capitalize ${
        colors[status] ?? "bg-gray-100 text-gray-700"
      }`}
    >
      {status}
    </span>
  );
}
