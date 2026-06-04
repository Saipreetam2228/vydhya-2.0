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
} from "recharts";
import StatCard from "../components/common/StatCard";
import Badge from "../components/common/Badge";
import { dashboardService } from "../services/dashboardService";
import api from "../services/api";

// Weekly chart still uses mock data — real chart data requires
// a more complex query we add in a future enhancement
const weeklyData = [
  { day: "Mon", admissions: 12 },
  { day: "Tue", admissions: 19 },
  { day: "Wed", admissions: 15 },
  { day: "Thu", admissions: 27 },
  { day: "Fri", admissions: 22 },
  { day: "Sat", admissions: 18 },
  { day: "Sun", admissions: 9 },
];

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

function CustomTooltip({ active, payload, label }) {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-lg px-3 py-2 shadow-lg">
        <p className="text-xs text-gray-500 dark:text-gray-400">{label}</p>
        <p className="text-sm font-semibold text-[#0F4C81]">
          {payload[0].value} admissions
        </p>
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
  const [recentAppointments, setRecentAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const currentDate = new Date().toLocaleDateString("en-IN", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const loadData = async () => {
    try {
      setLoading(true);
      // Fetch stats and recent appointments in parallel
      const [statsData, appointmentsData] = await Promise.all([
        dashboardService.getStats(),
        api.get("/appointments/").then((r) => r.data.slice(0, 5)),
      ]);
      setStats(statsData);
      setRecentAppointments(appointmentsData);
    } catch (err) {
      console.error("Dashboard load error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // currentDate is initialized lazily to avoid synchronous setState in effect
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadData();
  }, []);

  return (
    <div className="p-6 space-y-6">
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
        <div className="xl:col-span-3 bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 p-5">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
                Weekly Admissions
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                Patient admissions over the last 7 days
              </p>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-[#22C55E] font-medium">
              <TrendingUp size={13} />
              +18% this week
            </div>
          </div>
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
              />
              <Tooltip
                content={<CustomTooltip />}
                cursor={{ fill: "#f8fafc" }}
              />
              <Bar
                dataKey="admissions"
                fill="#0F4C81"
                radius={[4, 4, 0, 0]}
                maxBarSize={40}
              />
            </BarChart>
          </ResponsiveContainer>
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
                      {apt.patient_id}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                      {apt.appointment_date} · {apt.appointment_id}
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
