import { useState, useEffect, useMemo } from "react";
import { Plus, Search, Pencil, Trash2, Eye, Stethoscope } from "lucide-react";
import PageHeader from "../components/common/PageHeader";
import DataTable from "../components/common/DataTable";
import Badge from "../components/common/Badge";
import Modal from "../components/common/Modal";
import DoctorForm from "../components/forms/DoctorForm";
import { doctorService } from "../services/doctorService";
import toast from "react-hot-toast";

const ITEMS_PER_PAGE = 5;

function fromApiResponse(doctor) {
  return {
    id: doctor.id,
    doctorId: doctor.doctor_id,
    firstName: doctor.first_name,
    lastName: doctor.last_name,
    specialty: doctor.specialty,
    experience: doctor.experience_years,
    contact: doctor.contact,
    email: doctor.email || "",
    status: doctor.status,
  };
}

function toApiPayload(form) {
  return {
    first_name: form.firstName,
    last_name: form.lastName,
    specialty: form.specialty,
    experience_years: parseInt(form.experience),
    contact: form.contact,
    email: form.email,
    status: form.status,
  };
}

function StatStrip({ label, value, color }) {
  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 px-4 py-3 flex items-center gap-3">
      <span className={`w-1.5 h-8 rounded-full flex-shrink-0 ${color}`} />
      <div>
        <p className="text-xs text-gray-500 dark:text-gray-400">{label}</p>
        <p className="text-xl font-semibold text-gray-900 dark:text-white">
          {value}
        </p>
      </div>
    </div>
  );
}

export default function Doctors() {
  const [doctors, setDoctors] = useState([]);
  // eslint-disable-next-line no-unused-vars
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [showFormModal, setShowFormModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [editingDoctor, setEditingDoctor] = useState(null);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/immutability
    loadDoctors();
  }, []);

  const loadDoctors = async () => {
    try {
      setLoading(true);
      const data = await doctorService.getAll();
      setDoctors(data.map(fromApiResponse));
      // eslint-disable-next-line no-unused-vars
    } catch (err) {
      toast.error("Failed to load doctors");
    } finally {
      setLoading(false);
    }
  };

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return doctors.filter(
      (d) =>
        `${d.firstName} ${d.lastName}`.toLowerCase().includes(q) ||
        d.id.toLowerCase().includes(q) ||
        d.specialty.toLowerCase().includes(q) ||
        d.email.toLowerCase().includes(q),
    );
  }, [doctors, search]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
  const paginated = filtered.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE,
  );

  const handleSearch = (e) => {
    setSearch(e.target.value);
    setCurrentPage(1);
  };

  const handleAdd = async (formData) => {
    try {
      await doctorService.create(toApiPayload(formData));
      toast.success(`Dr. ${formData.firstName} ${formData.lastName} added`);
      setShowFormModal(false);
      loadDoctors();
    } catch (err) {
      toast.error(err.response?.data?.detail || "Failed to add doctor");
    }
  };

  const handleEditOpen = (doctor) => {
    setEditingDoctor(doctor);
    setShowFormModal(true);
  };

  const handleEdit = async (formData) => {
    try {
      await doctorService.update(editingDoctor.id, toApiPayload(formData));
      toast.success("Doctor updated successfully");
      setShowFormModal(false);
      setEditingDoctor(null);
      loadDoctors();
    } catch (err) {
      toast.error(err.response?.data?.detail || "Failed to update doctor");
    }
  };

  const handleDeleteOpen = (doctor) => {
    setSelectedDoctor(doctor);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      await doctorService.delete(selectedDoctor.id);
      toast.success(
        `Dr. ${selectedDoctor.firstName} ${selectedDoctor.lastName} removed`,
      );
      setShowDeleteModal(false);
      setSelectedDoctor(null);
      loadDoctors();
      // eslint-disable-next-line no-unused-vars
    } catch (err) {
      toast.error("Failed to delete doctor");
    }
  };

  const handleView = (doctor) => {
    setSelectedDoctor(doctor);
    setShowViewModal(true);
  };

  const handleFormModalClose = () => {
    setShowFormModal(false);
    setEditingDoctor(null);
  };

  const activeCount = doctors.filter((d) => d.status === "Active").length;
  const onLeaveCount = doctors.filter((d) => d.status === "On Leave").length;
  const inactiveCount = doctors.filter((d) => d.status === "Inactive").length;

  const columns = [
    {
      key: "name",
      label: "Doctor",
      width: "220px",
      render: (row) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center flex-shrink-0">
            <Stethoscope size={14} className="text-[#0F4C81]" />
          </div>
          <div>
            <p className="font-medium text-gray-900 dark:text-white text-sm">
              Dr. {row.firstName} {row.lastName}
            </p>
            <p className="text-xs text-gray-400">{row.id}</p>
          </div>
        </div>
      ),
    },
    {
      key: "specialty",
      label: "Specialty",
      render: (row) => (
        <span className="text-sm text-gray-700 dark:text-gray-300">
          {row.specialty}
        </span>
      ),
    },
    {
      key: "experience",
      label: "Experience",
      render: (row) => (
        <span className="text-sm text-gray-700 dark:text-gray-300">
          {row.experience} yr{row.experience !== 1 ? "s" : ""}
        </span>
      ),
    },
    {
      key: "contact",
      label: "Contact",
      render: (row) => (
        <div>
          <p className="font-mono text-xs text-gray-700 dark:text-gray-300">
            {row.contact}
          </p>
          <p className="text-xs text-gray-400 mt-0.5 truncate max-w-[160px]">
            {row.email}
          </p>
        </div>
      ),
    },
    {
      key: "status",
      label: "Status",
      render: (row) => <Badge status={row.status} />,
    },
    {
      key: "actions",
      label: "Actions",
      width: "110px",
      render: (row) => (
        <div className="flex items-center gap-1">
          <button
            onClick={() => handleView(row)}
            title="View"
            className="w-7 h-7 rounded-lg flex items-center justify-center text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-blue-500 transition-colors"
          >
            <Eye size={13} />
          </button>
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
        title="Doctors"
        subtitle={`${filtered.length} doctor${filtered.length !== 1 ? "s" : ""} found`}
        action={
          <button
            onClick={() => {
              setEditingDoctor(null);
              setShowFormModal(true);
            }}
            className="flex items-center gap-2 bg-[#0F4C81] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#1a5f9e] transition-colors"
          >
            <Plus size={15} />
            Add Doctor
          </button>
        }
      />

      {/* Stats strip */}
      <div className="grid grid-cols-3 gap-3">
        <StatStrip label="Active" value={activeCount} color="bg-green-500" />
        <StatStrip label="On Leave" value={onLeaveCount} color="bg-amber-400" />
        <StatStrip
          label="Inactive"
          value={inactiveCount}
          color="bg-gray-300 dark:bg-gray-600"
        />
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <Search
          size={14}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
        />
        <input
          type="text"
          value={search}
          onChange={handleSearch}
          placeholder="Search by name, ID or specialty..."
          className="w-full h-10 pl-9 pr-3 text-sm border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
        />
      </div>

      {/* Table */}
      <DataTable
        columns={columns}
        data={paginated}
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
        emptyMessage="No doctors found. Try a different search or add a new doctor."
      />

      {/* Add / Edit Modal */}
      <Modal
        isOpen={showFormModal}
        onClose={handleFormModalClose}
        title={editingDoctor ? "Edit Doctor" : "Add New Doctor"}
        size="lg"
      >
        <DoctorForm
          initial={editingDoctor}
          onSubmit={editingDoctor ? handleEdit : handleAdd}
          onCancel={handleFormModalClose}
        />
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="Remove Doctor"
        size="sm"
      >
        <div className="text-center">
          <div className="w-12 h-12 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-3">
            <Trash2 size={20} className="text-red-500" />
          </div>
          <p className="text-sm text-gray-700 dark:text-gray-300 mb-1">
            Are you sure you want to remove
          </p>
          <p className="text-sm font-semibold text-gray-900 dark:text-white mb-1">
            Dr. {selectedDoctor?.firstName} {selectedDoctor?.lastName}
          </p>
          <p className="text-xs text-gray-400 mb-5">
            {selectedDoctor?.id} · {selectedDoctor?.specialty} · This action
            cannot be undone.
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
              Yes, Remove
            </button>
          </div>
        </div>
      </Modal>

      {/* View Details Modal */}
      <Modal
        isOpen={showViewModal}
        onClose={() => setShowViewModal(false)}
        title="Doctor Details"
        size="md"
      >
        {selectedDoctor && (
          <div className="space-y-4">
            <div className="flex items-center gap-4 pb-4 border-b border-gray-100 dark:border-gray-800">
              <div className="w-14 h-14 rounded-full bg-[#0F4C81] flex items-center justify-center text-white text-xl font-semibold flex-shrink-0">
                {selectedDoctor.firstName.charAt(0)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-gray-900 dark:text-white">
                  Dr. {selectedDoctor.firstName} {selectedDoctor.lastName}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {selectedDoctor.specialty}
                </p>
                <p className="text-xs text-gray-400 mt-0.5">
                  {selectedDoctor.id}
                </p>
              </div>
              <Badge status={selectedDoctor.status} />
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm">
              {[
                {
                  label: "Experience",
                  value: `${selectedDoctor.experience} years`,
                },
                { label: "Specialty", value: selectedDoctor.specialty },
                { label: "Contact", value: selectedDoctor.contact },
                { label: "Email", value: selectedDoctor.email },
              ].map(({ label, value }) => (
                <div key={label}>
                  <p className="text-xs text-gray-400 mb-0.5">{label}</p>
                  <p className="text-gray-800 dark:text-gray-200 font-medium truncate">
                    {value}
                  </p>
                </div>
              ))}
            </div>

            <div className="pt-2 border-t border-gray-100 dark:border-gray-800">
              <div className="flex items-center justify-between mb-1.5">
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Experience Level
                </p>
                <p className="text-xs font-medium text-[#0F4C81]">
                  {selectedDoctor.experience} / 30 yrs
                </p>
              </div>
              <div className="h-2 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#0F4C81] rounded-full transition-all duration-500"
                  style={{
                    width: `${Math.min(
                      (selectedDoctor.experience / 30) * 100,
                      100,
                    )}%`,
                  }}
                />
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
