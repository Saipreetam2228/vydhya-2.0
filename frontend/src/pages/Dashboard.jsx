import { useState, useEffect } from "react";
import {
  Users,
  Stethoscope,
  Calendar,
  Activity,
  TrendingUp,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import StatCard from "../components/common/StatCard";
import Badge from "../components/common/Badge";
import { dashboardService } from "../services/dashboardService";
import api from "../services/api";

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

// Builds the last-7-days array with real admission counts
function buildWeeklyData(patients) {
  const days = [];
  const today = new Date();

  for (let i = 6; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);

    const label = d.toLocaleDateString("en-IN", { weekday: "short" });
    const fullDate = d.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
    const dateStr = d.toISOString().split("T")[0]; // YYYY-MM-DD

    // Count patients whose created_at matches this date
    const count = patients.filter((p) => {
      if (!p.created_at) return false;
      return p.created_at.split("T")[0] === dateStr;
    }).length;

    days.push({
      day: label,
      fullDate,
      admissions: count,
      isToday: i === 0,
    });
  }
  return days;
}

// Custom tooltip showing exact date + count
// eslint-disable-next-line no-unused-vars
function CustomTooltip({ active, payload, label }) {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-lg px-3 py-2 shadow-lg">
        <p className="text-xs text-gray-400 mb-0.5">{data.fullDate}</p>
        <p className="text-sm font-semibold text-[#0F4C81]">
          {data.admissions} admission{data.admissions !== 1 ? "s" : ""}
        </p>
        {data.isToday && <p className="text-xs text-[#22C55E] mt-0.5">Today</p>}
      </div>
    );
  }
  return null;
}

export default function Dashboard() {
  const [stats, setStats] = useState({
    total_patients: 0,
    total_doctors: 0,
    total_appointments: 0,
    today_appointments: 0,
  });
  const [weeklyData, setWeeklyData] = useState([]);
  const [recentAppointments, setRecentAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentDate, setCurrentDate] = useState("");

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setCurrentDate(
      new Date().toLocaleDateString("en-IN", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
    );
    // eslint-disable-next-line react-hooks/immutability
    loadData();

    // Refresh every 60 seconds so chart stays live
    const interval = setInterval(loadData, 60000);
    return () => clearInterval(interval);
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [statsData, appointmentsData, patientsData] = await Promise.all([
        dashboardService.getStats(),
        api.get("/appointments/").then((r) => r.data.slice(0, 5)),
        api.get("/patients/").then((r) => r.data),
      ]);
      setStats(statsData);
      setRecentAppointments(appointmentsData);

      // Build live weekly chart from real patient created_at dates
      setWeeklyData(buildWeeklyData(patientsData));
    } catch (err) {
      console.error("Dashboard load error:", err);
    } finally {
      setLoading(false);
    }
  };

  const totalThisWeek = weeklyData.reduce((sum, d) => sum + d.admissions, 0);

  return (
    <div className="p-6 space-y-6">
      {/* Greeting */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
          {getGreeting()}, Admin
        </h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
          {currentDate} · Here's what's happening at the hospital today.
        </p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard
          label="Total Patients"
          value={loading ? "—" : stats.total_patients}
          change="Live from database"
          changeType="positive"
          icon={Users}
          iconBg="bg-[#0F4C81]"
        />
        <StatCard
          label="Total Doctors"
          value={loading ? "—" : stats.total_doctors}
          change="Active medical staff"
          changeType="neutral"
          icon={Stethoscope}
          iconBg="bg-[#4A90E2]"
        />
        <StatCard
          label="Appointments"
          value={loading ? "—" : stats.total_appointments}
          change="All time total"
          changeType="positive"
          icon={Calendar}
          iconBg="bg-[#22C55E]"
        />
        <StatCard
          label="Today's Visits"
          value={loading ? "—" : stats.today_appointments}
          change="Scheduled for today"
          changeType="positive"
          icon={Activity}
          iconBg="bg-purple-500"
        />
      </div>

      {/* Chart + Recent appointments */}
      <div className="grid grid-cols-1 xl:grid-cols-5 gap-4">
        {/* Live weekly admissions chart */}
        <div className="xl:col-span-3 bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 p-5">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
                Weekly Admissions
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                Live patient registrations — last 7 days
              </p>
            </div>
            <div className="text-right">
              <div className="flex items-center gap-1.5 text-xs text-[#22C55E] font-medium justify-end">
                <TrendingUp size={13} />
                {totalThisWeek} this week
              </div>
              <p className="text-xs text-gray-400 mt-0.5">
                Auto-refreshes every 60s
              </p>
            </div>
          </div>

          {loading ? (
            <div className="h-[200px] flex items-center justify-center">
              <div className="animate-spin w-6 h-6 border-2 border-[#0F4C81] border-t-transparent rounded-full" />
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={200}>
              <BarChart
                data={weeklyData}
                margin={{ top: 0, right: 0, left: -20, bottom: 0 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#f0f0f0"
                  vertical={false}
                />
                <XAxis
                  dataKey="day"
                  tick={{ fontSize: 11, fill: "#9ca3af" }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fontSize: 11, fill: "#9ca3af" }}
                  axisLine={false}
                  tickLine={false}
                  allowDecimals={false}
                  minTickGap={1}
                />
                <Tooltip
                  content={<CustomTooltip />}
                  cursor={{ fill: "#f8fafc" }}
                />
                <Bar dataKey="admissions" radius={[4, 4, 0, 0]} maxBarSize={40}>
                  {weeklyData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={entry.isToday ? "#22C55E" : "#0F4C81"}
                      opacity={entry.isToday ? 1 : 0.7}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          )}

          {/* Legend */}
          <div className="flex items-center gap-4 mt-3 pt-3 border-t border-gray-50 dark:border-gray-800">
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded bg-[#0F4C81] opacity-70" />
              <span className="text-xs text-gray-500 dark:text-gray-400">
                Previous days
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded bg-[#22C55E]" />
              <span className="text-xs text-gray-500 dark:text-gray-400">
                Today
              </span>
            </div>
            <span className="text-xs text-gray-400 ml-auto">
              ← Hover bars for exact date
            </span>
          </div>
        </div>

        {/* Recent appointments */}
        <div className="xl:col-span-2 bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
              Recent Appointments
            </h3>
            <a
              href="/appointments"
              className="text-xs text-[#4A90E2] hover:underline"
            >
              View all
            </a>
          </div>

          {loading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="animate-pulse">
                  <div className="h-3 bg-gray-100 dark:bg-gray-800 rounded w-3/4 mb-1" />
                  <div className="h-2 bg-gray-100 dark:bg-gray-800 rounded w-1/2" />
                </div>
              ))}
            </div>
          ) : recentAppointments.length === 0 ? (
            <p className="text-sm text-gray-400 text-center py-6">
              No appointments yet
            </p>
          ) : (
            <div className="space-y-3">
              {recentAppointments.map((apt) => (
                <div
                  key={apt.id}
                  className="flex items-start justify-between py-2 border-b border-gray-50 dark:border-gray-800 last:border-0"
                >
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                      {apt.appointment_id}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                      {apt.appointment_date}
                    </p>
                  </div>
                  <div className="ml-3 flex-shrink-0">
                    <Badge status={apt.status} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
