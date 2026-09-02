interface StatusBadgeProps {
  status: string;
}

export default function StatusBadge({
  status,
}: StatusBadgeProps) {
  const statusStyles: Record<string, string> = {
    active: "bg-green-100 text-green-700",
    idle: "bg-yellow-100 text-yellow-700",
    offline: "bg-red-100 text-red-700",
    maintenance: "bg-blue-100 text-blue-700",
  };

  const style =
    statusStyles[status.toLowerCase()] ??
    "bg-gray-100 text-gray-700";

  return (
    <span
      className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-medium capitalize ${style}`}
    >
      {status}
    </span>
  );
}
