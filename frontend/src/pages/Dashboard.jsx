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
import "../components/common/PageHeader";

// Mock data — replaced with real API in Phase 10
const weeklyData = [
  { day: "Mon", admissions: 12 },
  { day: "Tue", admissions: 19 },
  { day: "Wed", admissions: 15 },
  { day: "Thu", admissions: 27 },
  { day: "Fri", admissions: 22 },
  { day: "Sat", admissions: 18 },
  { day: "Sun", admissions: 9 },
];

const recentAppointments = [
  {
    id: "APT-00001",
    patient: "Aarav Sharma",
    doctor: "Dr. Priya Sharma",
    date: "2025-06-02",
    time: "10:00 AM",
    status: "Completed",
  },
  {
    id: "APT-00002",
    patient: "Sita Patel",
    doctor: "Dr. Ramesh Bandaru",
    date: "2025-06-02",
    time: "11:30 AM",
    status: "Scheduled",
  },
  {
    id: "APT-00003",
    patient: "Ravi Kumar",
    doctor: "Dr. Ananya Iyer",
    date: "2025-06-02",
    time: "02:00 PM",
    status: "Cancelled",
  },
  {
    id: "APT-00004",
    patient: "Meena Reddy",
    doctor: "Dr. Kiran Rao",
    date: "2025-06-02",
    time: "03:30 PM",
    status: "Scheduled",
  },
  {
    id: "APT-00005",
    patient: "Arjun Nair",
    doctor: "Dr. Priya Sharma",
    date: "2025-06-02",
    time: "04:00 PM",
    status: "Completed",
  },
];

// Greeting based on time of day
function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

// Custom tooltip for the bar chart
function CustomTooltip({ active, payload, label }) {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-lg px-3 py-2 shadow-lg">
        <p className="text-xs text-gray-500 dark:text-gray-400">{label}</p>
        <p className="text-sm font-semibold text-primary">
          {payload[0].value} admissions
        </p>
      </div>
    );
  }
  return null;
}

export default function Dashboard() {
  const [currentDate, setCurrentDate] = useState("");

  useEffect(() => {
    const now = new Date();
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setCurrentDate(
      now.toLocaleDateString("en-IN", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
    );
  }, []);

  return (
    <div className="page-container">
      {/* Page header */}
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
          value="248"
          change="↑ 12 registered this week"
          changeType="positive"
          icon={Users}
          iconBg="bg-primary"
        />
        <StatCard
          label="Total Doctors"
          value="34"
          change="3 currently on leave"
          changeType="neutral"
          icon={Stethoscope}
          iconBg="bg-secondary"
        />
        <StatCard
          label="Appointments"
          value="91"
          change="↑ 7 scheduled today"
          changeType="positive"
          icon={Calendar}
          iconBg="bg-accent"
        />
        <StatCard
          label="Today's Visits"
          value="18"
          change="↑ 4 more than yesterday"
          changeType="positive"
          icon={Activity}
          iconBg="bg-purple-500"
        />
      </div>

      {/* Chart + Recent Appointments */}
      <div className="grid grid-cols-1 xl:grid-cols-5 gap-4">
        {/* Weekly admissions chart — takes 3 of 5 columns */}
        <div className="xl:col-span-3 card p-5">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
                Weekly Admissions
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                Patient admissions over the last 7 days
              </p>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-accent font-medium">
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

        {/* Recent appointments — takes 2 of 5 columns */}
        <div className="xl:col-span-2 card p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
              Recent Appointments
            </h3>
            <a
              href="/appointments"
              className="text-xs text-secondary hover:underline"
            >
              View all
            </a>
          </div>
          <div className="space-y-3">
            {recentAppointments.map((apt) => (
              <div
                key={apt.id}
                className="flex items-start justify-between py-2 border-b border-gray-50 dark:border-gray-800 last:border-0"
              >
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                    {apt.patient}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 truncate">
                    {apt.doctor} · {apt.time}
                  </p>
                </div>
                <div className="ml-3 flex-shrink-0">
                  <Badge status={apt.status} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick stats row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="card p-4 flex items-center gap-4">
          <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-xl flex items-center justify-center flex-shrink-0">
            <Users size={18} className="text-accent" />
          </div>
          <div>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Active Patients
            </p>
            <p className="text-lg font-semibold text-gray-900 dark:text-white">
              186
            </p>
          </div>
        </div>
        <div className="card p-4 flex items-center gap-4">
          <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center flex-shrink-0">
            <Stethoscope size={18} className="text-secondary" />
          </div>
          <div>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Active Doctors
            </p>
            <p className="text-lg font-semibold text-gray-900 dark:text-white">
              31
            </p>
          </div>
        </div>
        <div className="card p-4 flex items-center gap-4">
          <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-xl flex items-center justify-center flex-shrink-0">
            <Calendar size={18} className="text-purple-500" />
          </div>
          <div>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              This Month
            </p>
            <p className="text-lg font-semibold text-gray-900 dark:text-white">
              312 apts
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
