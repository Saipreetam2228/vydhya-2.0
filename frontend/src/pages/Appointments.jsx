import { useState, useMemo } from "react";
import {
  Plus,
  Search,
  Pencil,
  Trash2,
  Calendar,
  Clock,
  ChevronDown,
} from "lucide-react";
import PageHeader from "../components/common/PageHeader";
import DataTable from "../components/common/DataTable";
import Badge from "../components/common/Badge";
import Modal from "../components/common/Modal";
import AppointmentForm from "../components/forms/AppointmentForm";
import toast from "react-hot-toast";

// Mock data — replaced with real API in Phase 10
const initialAppointments = [
  {
    id: "APT-00001",
    patientName: "Aarav Sharma",
    doctorName: "Dr. Ramesh Bandaru",
    date: "2025-06-10",
    time: "10:00",
    reason: "Routine dental checkup",
    status: "Scheduled",
  },
  {
    id: "APT-00002",
    patientName: "Sita Patel",
    doctorName: "Dr. Priya Sharma",
    date: "2025-06-10",
    time: "11:30",
    reason: "Follow-up consultation",
    status: "Completed",
  },
  {
    id: "APT-00003",
    patientName: "Ravi Kumar",
    doctorName: "Dr. Ananya Iyer",
    date: "2025-06-11",
    time: "09:00",
    reason: "Chest pain evaluation",
    status: "Scheduled",
  },
  {
    id: "APT-00004",
    patientName: "Meena Reddy",
    doctorName: "Dr. Kiran Rao",
    date: "2025-06-11",
    time: "14:00",
    reason: "Headache and dizziness",
    status: "Cancelled",
  },
  {
    id: "APT-00005",
    patientName: "Arjun Nair",
    doctorName: "Dr. Priya Sharma",
    date: "2025-06-12",
    time: "16:00",
    reason: "Anxiety management session",
    status: "Scheduled",
  },
  {
    id: "APT-00006",
    patientName: "Divya Menon",
    doctorName: "Dr. Ramesh Bandaru",
    date: "2025-06-12",
    time: "10:30",
    reason: "Tooth extraction",
    status: "Completed",
  },
  {
    id: "APT-00007",
    patientName: "Karthik Iyer",
    doctorName: "Dr. Sathya Adapa",
    date: "2025-06-13",
    time: "11:00",
    reason: "Knee pain review",
    status: "Scheduled",
  },
  {
    id: "APT-00008",
    patientName: "Priya Rao",
    doctorName: "Dr. Meera Pillai",
    date: "2025-06-13",
    time: "15:30",
    reason: "Skin allergy treatment",
    status: "Completed",
  },
];

const ITEMS_PER_PAGE = 5;
const STATUS_FILTERS = ["All", "Scheduled", "Completed", "Cancelled"];

function generateAptId(appointments) {
  const max = appointments.reduce((acc, a) => {
    const num = parseInt(a.id.replace("APT-", ""));
    return num > acc ? num : acc;
  }, 0);
  return `APT-${String(max + 1).padStart(5, "0")}`;
}

// Formats "10:00" → "10:00 AM"
function formatTime(time) {
  if (!time) return "—";
  const [h, m] = time.split(":").map(Number);
  const suffix = h >= 12 ? "PM" : "AM";
  const hour = h % 12 || 12;
  return `${hour}:${String(m).padStart(2, "0")} ${suffix}`;
}

// Formats "2025-06-10" → "10 Jun 2025"
function formatDate(date) {
  if (!date) return "—";
  return new Date(date).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export default function Appointments() {
  const [appointments, setAppointments] = useState(initialAppointments);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [showFormModal, setShowFormModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedApt, setSelectedApt] = useState(null);
  const [editingApt, setEditingApt] = useState(null);

  // Filter by search + status chip
  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return appointments.filter((a) => {
      const matchesSearch =
        a.patientName.toLowerCase().includes(q) ||
        a.doctorName.toLowerCase().includes(q) ||
        a.id.toLowerCase().includes(q);
      const matchesStatus = statusFilter === "All" || a.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [appointments, search, statusFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
  const paginated = filtered.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE,
  );

  const handleSearch = (e) => {
    setSearch(e.target.value);
    setCurrentPage(1);
  };

  const handleFilterChange = (filter) => {
    setStatusFilter(filter);
    setCurrentPage(1);
  };

  const handleAdd = (formData) => {
    const newApt = { ...formData, id: generateAptId(appointments) };
    setAppointments((prev) => [newApt, ...prev]);
    setShowFormModal(false);
    toast.success("Appointment booked successfully");
  };

  const handleEditOpen = (apt) => {
    setEditingApt(apt);
    setShowFormModal(true);
  };

  const handleEdit = (formData) => {
    setAppointments((prev) =>
      prev.map((a) =>
        a.id === editingApt.id ? { ...formData, id: editingApt.id } : a,
      ),
    );
    setShowFormModal(false);
    setEditingApt(null);
    toast.success("Appointment updated successfully");
  };

  const handleDeleteOpen = (apt) => {
    setSelectedApt(apt);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = () => {
    setAppointments((prev) => prev.filter((a) => a.id !== selectedApt.id));
    setShowDeleteModal(false);
    toast.success(`${selectedApt.id} removed`);
    setSelectedApt(null);
  };

  // Quick status toggle directly from the table row
  const handleStatusToggle = (apt) => {
    const cycle = {
      Scheduled: "Completed",
      Completed: "Cancelled",
      Cancelled: "Scheduled",
    };
    const newStatus = cycle[apt.status];
    setAppointments((prev) =>
      prev.map((a) => (a.id === apt.id ? { ...a, status: newStatus } : a)),
    );
    toast.success(`${apt.id} marked as ${newStatus}`);
  };

  const handleFormModalClose = () => {
    setShowFormModal(false);
    setEditingApt(null);
  };

  // Summary counts
  const scheduledCount = appointments.filter(
    (a) => a.status === "Scheduled",
  ).length;
  const completedCount = appointments.filter(
    (a) => a.status === "Completed",
  ).length;
  const cancelledCount = appointments.filter(
    (a) => a.status === "Cancelled",
  ).length;

  const columns = [
    {
      key: "id",
      label: "Appointment",
      width: "130px",
      render: (row) => (
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center flex-shrink-0">
            <Calendar size={13} className="text-[#0F4C81]" />
          </div>
          <span className="text-xs font-mono text-gray-500 dark:text-gray-400">
            {row.id}
          </span>
        </div>
      ),
    },
    {
      key: "patient",
      label: "Patient",
      render: (row) => (
        <p className="text-sm font-medium text-gray-900 dark:text-white">
          {row.patientName}
        </p>
      ),
    },
    {
      key: "doctor",
      label: "Doctor",
      render: (row) => (
        <p className="text-sm text-gray-700 dark:text-gray-300">
          {row.doctorName}
        </p>
      ),
    },
    {
      key: "schedule",
      label: "Date & Time",
      render: (row) => (
        <div>
          <p className="text-sm text-gray-800 dark:text-gray-200">
            {formatDate(row.date)}
          </p>
          <p className="text-xs text-gray-400 flex items-center gap-1 mt-0.5">
            <Clock size={10} />
            {formatTime(row.time)}
          </p>
        </div>
      ),
    },
    {
      key: "reason",
      label: "Reason",
      render: (row) => (
        <p className="text-xs text-gray-500 dark:text-gray-400 max-w-[160px] truncate">
          {row.reason || "—"}
        </p>
      ),
    },
    {
      key: "status",
      label: "Status",
      render: (row) => (
        <button
          onClick={() => handleStatusToggle(row)}
          title="Click to cycle status"
          className="flex items-center gap-1 group"
        >
          <Badge status={row.status} />
          <ChevronDown
            size={11}
            className="text-gray-300 group-hover:text-gray-500 transition-colors"
          />
        </button>
      ),
    },
    {
      key: "actions",
      label: "Actions",
      width: "80px",
      render: (row) => (
        <div className="flex items-center gap-1">
          <button
            onClick={() => handleEditOpen(row)}
            title="Edit"
            className="w-7 h-7 rounded-lg flex items-center justify-center text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-[#0F4C81] transition-colors"
          >
            <Pencil size={13} />
          </button>
          <button
            onClick={() => handleDeleteOpen(row)}
            title="Delete"
            className="w-7 h-7 rounded-lg flex items-center justify-center text-gray-400 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-500 transition-colors"
          >
            <Trash2 size={13} />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="p-6 space-y-5">
      {/* Header */}
      <PageHeader
        title="Appointments"
        subtitle={`${filtered.length} appointment${filtered.length !== 1 ? "s" : ""} found`}
        action={
          <button
            onClick={() => {
              setEditingApt(null);
              setShowFormModal(true);
            }}
            className="flex items-center gap-2 bg-[#0F4C81] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#1a5f9e] transition-colors"
          >
            <Plus size={15} />
            New Appointment
          </button>
        }
      />

      {/* Summary strip */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: "Scheduled", count: scheduledCount, color: "bg-blue-500" },
          { label: "Completed", count: completedCount, color: "bg-green-500" },
          { label: "Cancelled", count: cancelledCount, color: "bg-red-400" },
        ].map(({ label, count, color }) => (
          <div
            key={label}
            className="bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 px-4 py-3 flex items-center gap-3 cursor-pointer hover:border-gray-300 dark:hover:border-gray-600 transition-colors"
            onClick={() => handleFilterChange(label)}
          >
            <span className={`w-1.5 h-8 rounded-full flex-shrink-0 ${color}`} />
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {label}
              </p>
              <p className="text-xl font-semibold text-gray-900 dark:text-white">
                {count}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Search + Filter chips */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <Search
            size={14}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
          />
          <input
            type="text"
            value={search}
            onChange={handleSearch}
            placeholder="Search by patient, doctor or ID..."
            className="w-full h-10 pl-9 pr-3 text-sm border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
          />
        </div>

        {/* Status filter chips */}
        <div className="flex items-center gap-2">
          {STATUS_FILTERS.map((f) => (
            <button
              key={f}
              onClick={() => handleFilterChange(f)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                statusFilter === f
                  ? "bg-[#0F4C81] text-white"
                  : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700"
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <DataTable
        columns={columns}
        data={paginated}
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
        emptyMessage="No appointments found. Try a different filter or book a new appointment."
      />

      {/* Add / Edit Modal */}
      <Modal
        isOpen={showFormModal}
        onClose={handleFormModalClose}
        title={editingApt ? "Edit Appointment" : "Book New Appointment"}
        size="lg"
      >
        <AppointmentForm
          initial={editingApt}
          onSubmit={editingApt ? handleEdit : handleAdd}
          onCancel={handleFormModalClose}
        />
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="Cancel Appointment"
        size="sm"
      >
        <div className="text-center">
          <div className="w-12 h-12 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-3">
            <Trash2 size={20} className="text-red-500" />
          </div>
          <p className="text-sm text-gray-700 dark:text-gray-300 mb-1">
            Are you sure you want to delete
          </p>
          <p className="text-sm font-semibold text-gray-900 dark:text-white mb-1">
            {selectedApt?.id}
          </p>
          <p className="text-xs text-gray-400 mb-1">
            {selectedApt?.patientName} · {selectedApt?.doctorName}
          </p>
          <p className="text-xs text-gray-400 mb-5">
            {formatDate(selectedApt?.date)} at {formatTime(selectedApt?.time)}
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => setShowDeleteModal(false)}
              className="flex-1 px-4 py-2 text-sm border border-gray-200 dark:border-gray-700 rounded-lg text-gray-600 dark:text-gray-400 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleDeleteConfirm}
              className="flex-1 px-4 py-2 text-sm bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors font-medium"
            >
              Yes, Delete
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
