import { useState, useEffect, useMemo } from "react";
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
import { appointmentService } from "../services/appointmentService";
import { patientService } from "../services/patientService";
import { doctorService } from "../services/doctorService";
import toast from "react-hot-toast";

const ITEMS_PER_PAGE = 5;
const STATUS_FILTERS = ["All", "Scheduled", "Completed", "Cancelled"];

function formatTime(time) {
  if (!time) return "—";
  const [h, m] = time.split(":").map(Number);
  const suffix = h >= 12 ? "PM" : "AM";
  const hour = h % 12 || 12;
  return `${hour}:${String(m).padStart(2, "0")} ${suffix}`;
}

function formatDate(date) {
  if (!date) return "—";
  return new Date(date + "T00:00:00").toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

// Inline appointment form — uses live patient and doctor lists
function AppointmentForm({ initial, onSubmit, onCancel, patients, doctors }) {
  const [form, setForm] = useState({
    patient_id: "",
    doctor_id: "",
    date: "",
    time: "",
    reason: "",
    status: "Scheduled",
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initial) {
      setForm({
        patient_id: String(initial.patient_id || ""),
        doctor_id: String(initial.doctor_id || ""),
        date: initial.date || "",
        time: initial.time?.substring(0, 5) || "",
        reason: initial.reason || "",
        status: initial.status || "Scheduled",
      });
    }
  }, [initial]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validate = () => {
    const errs = {};
    if (!form.patient_id) errs.patient_id = "Select a patient";
    if (!form.doctor_id) errs.doctor_id = "Select a doctor";
    if (!form.date) errs.date = "Date is required";
    if (!form.time) errs.time = "Time is required";
    return errs;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    onSubmit(form);
  };

  const inputCls = (field) =>
    `w-full h-10 px-3 text-sm border rounded-lg bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all ${
      errors[field] ? "border-red-400" : "border-gray-200 dark:border-gray-700"
    }`;

  const STATUS_OPTIONS = ["Scheduled", "Completed", "Cancelled"];
  const statusColors = {
    Scheduled:
      "border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300",
    Completed:
      "border-green-500 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300",
    Cancelled:
      "border-red-400 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-300",
  };
  const dotColors = {
    Scheduled: "bg-blue-500",
    Completed: "bg-green-500",
    Cancelled: "bg-red-400",
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Participants */}
      <div>
        <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3 pb-2 border-b border-gray-100 dark:border-gray-800">
          Participants
        </p>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
              Patient <span className="text-red-500">*</span>
            </label>
            <select
              name="patient_id"
              value={form.patient_id}
              onChange={handleChange}
              className={inputCls("patient_id")}
            >
              <option value="">Select patient</option>
              {patients.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.first_name} {p.last_name} — {p.contact}
                </option>
              ))}
            </select>
            {errors.patient_id && (
              <p className="text-red-500 text-xs mt-1">{errors.patient_id}</p>
            )}
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
              Doctor <span className="text-red-500">*</span>
            </label>
            <select
              name="doctor_id"
              value={form.doctor_id}
              onChange={handleChange}
              className={inputCls("doctor_id")}
            >
              <option value="">Select doctor</option>
              {doctors
                .filter((d) => d.status === "Active")
                .map((d) => (
                  <option key={d.id} value={d.id}>
                    Dr. {d.first_name} {d.last_name} — {d.specialty}
                  </option>
                ))}
            </select>
            {errors.doctor_id && (
              <p className="text-red-500 text-xs mt-1">{errors.doctor_id}</p>
            )}
          </div>
        </div>
      </div>

      {/* Schedule */}
      <div>
        <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3 pb-2 border-b border-gray-100 dark:border-gray-800">
          Schedule
        </p>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
              Date <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              name="date"
              value={form.date}
              onChange={handleChange}
              className={inputCls("date")}
            />
            {errors.date && (
              <p className="text-red-500 text-xs mt-1">{errors.date}</p>
            )}
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
              Time <span className="text-red-500">*</span>
            </label>
            <input
              type="time"
              name="time"
              value={form.time}
              onChange={handleChange}
              className={inputCls("time")}
            />
            {errors.time && (
              <p className="text-red-500 text-xs mt-1">{errors.time}</p>
            )}
          </div>

          {/* Status selector */}
          <div className="col-span-2">
            <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-2">
              Status
            </label>
            <div className="flex gap-3">
              {STATUS_OPTIONS.map((s) => (
                <label
                  key={s}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-sm cursor-pointer transition-colors flex-1 justify-center ${
                    form.status === s
                      ? statusColors[s]
                      : "border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800"
                  }`}
                >
                  <input
                    type="radio"
                    name="status"
                    value={s}
                    checked={form.status === s}
                    onChange={handleChange}
                    className="hidden"
                  />
                  <span
                    className={`w-2 h-2 rounded-full flex-shrink-0 ${dotColors[s]}`}
                  />
                  {s}
                </label>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Reason */}
      <div>
        <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
          Reason / Notes
        </label>
        <textarea
          name="reason"
          value={form.reason}
          onChange={handleChange}
          placeholder="Describe the reason for this appointment..."
          rows={3}
          className="w-full px-3 py-2 text-sm border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all resize-none"
        />
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-2 pt-2 border-t border-gray-100 dark:border-gray-800">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-sm border border-gray-200 dark:border-gray-700 rounded-lg text-gray-600 dark:text-gray-400 hover:bg-gray-50 transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 text-sm bg-[#0F4C81] text-white rounded-lg hover:bg-[#1a5f9e] transition-colors font-medium"
        >
          {initial ? "Save Changes" : "Book Appointment"}
        </button>
      </div>
    </form>
  );
}

export default function Appointments() {
  const [appointments, setAppointments] = useState([]);
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [showFormModal, setShowFormModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedApt, setSelectedApt] = useState(null);
  const [editingApt, setEditingApt] = useState(null);
  const [statusDropdownId, setStatusDropdownId] = useState(null);

  useEffect(() => {
    loadAll();
  }, []);

  // Load appointments, patients, and doctors simultaneously
  const loadAll = async () => {
    try {
      setLoading(true);
      const [aptsData, patientsData, doctorsData] = await Promise.all([
        appointmentService.getAll(),
        patientService.getAll(),
        doctorService.getAll(),
      ]);
      setAppointments(aptsData);
      setPatients(patientsData);
      setDoctors(doctorsData);
    } catch (err) {
      toast.error("Failed to load appointments");
    } finally {
      setLoading(false);
    }
  };

  // Helper — get patient full name from ID
  const getPatientName = (id) => {
    const p = patients.find((p) => p.id === id);
    return p ? `${p.first_name} ${p.last_name}` : `Patient #${id}`;
  };

  // Helper — get doctor full name from ID
  const getDoctorName = (id) => {
    const d = doctors.find((d) => d.id === id);
    return d ? `Dr. ${d.first_name} ${d.last_name}` : `Doctor #${id}`;
  };

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return appointments.filter((a) => {
      const patientName = getPatientName(a.patient_id).toLowerCase();
      const doctorName = getDoctorName(a.doctor_id).toLowerCase();
      const matchesSearch =
        patientName.includes(q) ||
        doctorName.includes(q) ||
        a.appointment_id.toLowerCase().includes(q);
      const matchesStatus = statusFilter === "All" || a.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [appointments, search, statusFilter, patients, doctors]);

  const numbered = filtered.map((row, idx) => ({
    ...row,
    displayId: `APT-${String(idx + 1).padStart(5, "0")}`,
  }));

  const totalPages = Math.max(1, Math.ceil(numbered.length / ITEMS_PER_PAGE));
  const paginated = numbered.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE,
  );

  const handleSearch = (e) => {
    setSearch(e.target.value);
    setCurrentPage(1);
  };
  const handleFilterChange = (f) => {
    setStatusFilter(f);
    setCurrentPage(1);
  };

  const handleAdd = async (formData) => {
    try {
      await appointmentService.create({
        patient_id: parseInt(formData.patient_id),
        doctor_id: parseInt(formData.doctor_id),
        appointment_date: formData.date,
        appointment_time: formData.time,
        reason: formData.reason,
        status: formData.status,
      });
      toast.success("Appointment booked successfully");
      setShowFormModal(false);
      loadAll();
    } catch (err) {
      toast.error(err.response?.data?.detail || "Failed to book appointment");
    }
  };

  const handleEditOpen = (apt) => {
    setEditingApt({ ...apt });
    setShowFormModal(true);
  };

  const handleEdit = async (formData) => {
    try {
      await appointmentService.update(editingApt.id, {
        patient_id: parseInt(formData.patient_id),
        doctor_id: parseInt(formData.doctor_id),
        appointment_date: formData.date,
        appointment_time: formData.time,
        reason: formData.reason,
        status: formData.status,
      });
      toast.success("Appointment updated successfully");
      setShowFormModal(false);
      setEditingApt(null);
      loadAll();
    } catch (err) {
      toast.error("Failed to update appointment");
    }
  };

  const handleDeleteOpen = (apt) => {
    setSelectedApt(apt);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      await appointmentService.delete(selectedApt.id);
      toast.success(`${selectedApt.appointment_id} removed`);
      setShowDeleteModal(false);
      setSelectedApt(null);
      loadAll();
    } catch (err) {
      toast.error("Failed to delete appointment");
    }
  };

  const handleStatusChange = async (apt, newStatus) => {
    setStatusDropdownId(null);
    if (apt.status === newStatus) return;
    try {
      await appointmentService.update(apt.id, { status: newStatus });
      toast.success(`Status updated to ${newStatus}`);
      loadAll();
    } catch (err) {
      toast.error("Failed to update status");
    }
  };

  const handleFormModalClose = () => {
    setShowFormModal(false);
    setEditingApt(null);
  };

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
            {row.displayId}
          </span>
        </div>
      ),
    },
    {
      key: "patient",
      label: "Patient",
      render: (row) => (
        <p className="text-sm font-medium text-gray-900 dark:text-white">
          {getPatientName(row.patient_id)}
        </p>
      ),
    },
    {
      key: "doctor",
      label: "Doctor",
      render: (row) => (
        <p className="text-sm text-gray-700 dark:text-gray-300">
          {getDoctorName(row.doctor_id)}
        </p>
      ),
    },
    {
      key: "schedule",
      label: "Date & Time",
      render: (row) => (
        <div>
          <p className="text-sm text-gray-800 dark:text-gray-200">
            {formatDate(row.appointment_date)}
          </p>
          <p className="text-xs text-gray-400 flex items-center gap-1 mt-0.5">
            <Clock size={10} />
            {formatTime(row.appointment_time)}
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
      render: (row) => {
        const isOpen = statusDropdownId === row.id;
        const statusColors = {
          Scheduled:
            "border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300",
          Completed:
            "border-green-500 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300",
          Cancelled:
            "border-red-400 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-300",
        };
        return (
          <div className="relative inline-block">
            <button
              onClick={() => setStatusDropdownId(isOpen ? null : row.id)}
              className={`flex items-center gap-1 px-2 py-1 rounded border text-xs font-medium transition-colors ${statusColors[row.status] || ""}`}
            >
              <span
                className={
                  "w-1.5 h-1.5 rounded-full flex-shrink-0 " +
                  (row.status === "Scheduled"
                    ? "bg-blue-500"
                    : row.status === "Completed"
                      ? "bg-green-500"
                      : "bg-red-400")
                }
              />
              {row.status}
              <ChevronDown
                size={12}
                className={`transition-transform ${isOpen ? "rotate-180" : ""}`}
              />
            </button>
            {isOpen && (
              <div className="absolute top-full mt-1 left-0 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-10 min-w-[120px]">
                {["Scheduled", "Completed", "Cancelled"].map((status) => (
                  <button
                    key={status}
                    onClick={() => handleStatusChange(row, status)}
                    className={`block w-full text-left px-3 py-2 text-xs hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${
                      row.status === status
                        ? "bg-gray-50 dark:bg-gray-700 font-semibold"
                        : ""
                    }`}
                  >
                    {status}
                  </button>
                ))}
              </div>
            )}
          </div>
        );
      },
    },
    {
      key: "actions",
      label: "Actions",
      width: "80px",
      render: (row) => (
        <div className="flex items-center gap-1">
          <button
            onClick={() => handleEditOpen(row)}
            className="w-7 h-7 rounded-lg flex items-center justify-center text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-[#0F4C81] transition-colors"
          >
            <Pencil size={13} />
          </button>
          <button
            onClick={() => handleDeleteOpen(row)}
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
            onClick={() => handleFilterChange(label)}
            className="bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 px-4 py-3 flex items-center gap-3 cursor-pointer hover:border-gray-300 transition-colors"
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

      {/* Search + filter chips */}
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
            className="w-full h-10 pl-9 pr-3 text-sm border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>
        <div className="flex items-center gap-2">
          {STATUS_FILTERS.map((f) => (
            <button
              key={f}
              onClick={() => handleFilterChange(f)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                statusFilter === f
                  ? "bg-[#0F4C81] text-white"
                  : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200"
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      {loading ? (
        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 p-12 text-center">
          <div className="animate-spin w-8 h-8 border-2 border-[#0F4C81] border-t-transparent rounded-full mx-auto mb-3" />
          <p className="text-sm text-gray-400">Loading appointments...</p>
        </div>
      ) : (
        <DataTable
          columns={columns}
          data={paginated}
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          emptyMessage="No appointments found. Book your first appointment."
        />
      )}

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
          patients={patients}
          doctors={doctors}
        />
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="Delete Appointment"
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
            {selectedApt?.appointment_id}
          </p>
          <p className="text-xs text-gray-400 mb-1">
            {selectedApt ? getPatientName(selectedApt.patient_id) : ""} ·{" "}
            {selectedApt ? getDoctorName(selectedApt.doctor_id) : ""}
          </p>
          <p className="text-xs text-gray-400 mb-5">
            {formatDate(selectedApt?.appointment_date)} at{" "}
            {formatTime(selectedApt?.appointment_time)}
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => setShowDeleteModal(false)}
              className="flex-1 px-4 py-2 text-sm border border-gray-200 dark:border-gray-700 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors"
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
