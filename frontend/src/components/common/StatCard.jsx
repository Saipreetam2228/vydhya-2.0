export default function StatCard({
  label,
  value,
  change,
  changeType = "positive",
  icon: Icon,
  iconBg,
}) {
  return (
    <div className="card p-5">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
            {label}
          </p>
          <p className="text-2xl font-semibold text-gray-900 dark:text-white mt-1">
            {value}
          </p>
          {change && (
            <p
              className={`text-xs mt-1 font-medium ${
                changeType === "positive" ? "text-accent" : "text-secondary"
              }`}
            >
              {change}
            </p>
          )}
        </div>
        {Icon && (
          <div
            className={`w-10 h-10 rounded-xl flex items-center justify-center ${iconBg}`}
          >
            <Icon size={18} className="text-white" />
          </div>
        )}
      </div>
    </div>
  );
}
