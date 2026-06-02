// Maps status strings to Tailwind color classes
const variants = {
  Active:
    "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
  Discharged: "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400",
  "Under Observation":
    "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400",
  Scheduled: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
  Completed:
    "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
  Cancelled: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
  "On Leave":
    "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400",
  Inactive: "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400",
};

export default function Badge({ status }) {
  const classes = variants[status] || "bg-gray-100 text-gray-600";
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${classes}`}
    >
      {status}
    </span>
  );
}
