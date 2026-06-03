export default function StatCard({
  label,
  value,
  change,
  changeType = "positive",
  icon: Icon,
  iconBg,
}) {
  const changeColor =
    changeType === "positive"
      ? "text-accent"
      : changeType === "neutral"
        ? "text-secondary"
        : "text-danger";

  return (
    <div className="card p-5">
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
            {label}
          </p>
          <p className="text-2xl font-semibold text-gray-900 dark:text-white mt-1">
            {value}
          </p>
          {change && (
            <p className={`text-xs mt-1 font-medium ${changeColor}`}>
              {change}
            </p>
          )}
        </div>
        {Icon && (
          <div
            className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ml-3 ${iconBg}`}
          >
            <Icon size={18} className="text-white" />
          </div>
        )}
      </div>
    </div>
  );
}
