import { useState, useEffect, useMemo } from "react";
import { Plus, Search, Pencil, Trash2, Eye } from "lucide-react";
import PageHeader from "../components/common/PageHeader";
import DataTable from "../components/common/DataTable";
import Badge from "../components/common/Badge";
import Modal from "../components/common/Modal";
import PatientForm from "../components/forms/PatientForm";
import { patientService } from "../services/patientService";
import toast from "react-hot-toast";

const ITEMS_PER_PAGE = 5;

// Maps frontend form fields to backend field names
function toApiPayload(form) {
  return {
    first_name: form.firstName,
    last_name: form.lastName,
    age: parseInt(form.age),
    gender: form.gender,
    dob: form.dob || null,
    contact: form.contact,
    email: form.email || null,
    address: form.address || null,
    doctor_id: null,
    department: form.department || null,
    status: form.status,
  };
}

// Maps backend response fields to frontend form fields
function fromApiResponse(patient) {
  return {
    id: patient.id,
    patientId: patient.patient_id,
    firstName: patient.first_name,
    lastName: patient.last_name,
    age: patient.age,
    gender: patient.gender,
    dob: patient.dob || "",
    contact: patient.contact,
    email: patient.email || "",
    address: patient.address || "",
    doctor: "",
    department: patient.department || "",
    status: patient.status,
  };
}

export default function Patients() {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [editingPatient, setEditingPatient] = useState(null);

  // Load patients from backend on mount
  useEffect(() => {
    // eslint-disable-next-line react-hooks/immutability
    loadPatients();
  }, []);

  const loadPatients = async () => {
    try {
      setLoading(true);
      const data = await patientService.getAll();
      setPatients(data.map(fromApiResponse));
    } catch {
      toast.error("Failed to load patients");
    } finally {
      setLoading(false);
    }
  };

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return patients.filter(
      (p) =>
        `${p.firstName} ${p.lastName}`.toLowerCase().includes(q) ||
        (p.patientId || "").toLowerCase().includes(q) ||
        p.contact.includes(q) ||
        (p.department || "").toLowerCase().includes(q),
    );
  }, [patients, search]);

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
      await patientService.create(toApiPayload(formData));
      toast.success(
        `${formData.firstName} ${formData.lastName} added successfully`,
      );
      setShowAddModal(false);
      loadPatients();
    } catch (err) {
      const msg = err.response?.data?.detail || "Failed to add patient";
      toast.error(msg);
    }
  };

  const handleEditOpen = (patient) => {
    setEditingPatient(patient);
    setShowAddModal(true);
  };

  const handleEdit = async (formData) => {
    try {
      await patientService.update(editingPatient.id, toApiPayload(formData));
      toast.success("Patient record updated successfully");
      setShowAddModal(false);
      setEditingPatient(null);
      loadPatients();
    } catch (err) {
      const msg = err.response?.data?.detail || "Failed to update patient";
      toast.error(msg);
    }
  };

  const handleDeleteOpen = (patient) => {
    setSelectedPatient(patient);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      await patientService.delete(selectedPatient.id);
      toast.success(
        `${selectedPatient.firstName} ${selectedPatient.lastName} removed`,
      );
      setShowDeleteModal(false);
      setSelectedPatient(null);
      loadPatients();
    } catch {
      toast.error("Failed to delete patient");
    }
  };

  const handleView = (patient) => {
    setSelectedPatient(patient);
    setShowViewModal(true);
  };

  const handleModalClose = () => {
    setShowAddModal(false);
    setEditingPatient(null);
  };

  const columns = [
    {
      key: "id",
      label: "Patient",
      width: "220px",
      render: (row) => (
        <div>
          <p className="font-medium text-gray-900 dark:text-white text-sm">
            {row.firstName} {row.lastName}
          </p>
          <p className="text-xs text-gray-400 mt-0.5">{row.patientId}</p>
        </div>
      ),
    },
    {
      key: "contact",
      label: "Contact",
      render: (row) => (
        <span className="font-mono text-xs text-gray-700 dark:text-gray-300">
          {row.contact}
        </span>
      ),
    },
    {
      key: "doctor",
      label: "Department",
      render: (row) => (
        <span className="text-sm text-gray-600 dark:text-gray-400">
          {row.department || "—"}
        </span>
      ),
    },
    {
      key: "age",
      label: "Age / Gender",
      render: (row) => (
        <span className="text-sm text-gray-700 dark:text-gray-300">
          {row.age} · {row.gender}
        </span>
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
            className="w-7 h-7 rounded-lg flex items-center justify-center text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-blue-500 transition-colors"
          >
            <Eye size={13} />
          </button>
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
        title="Patients"
        subtitle={
          loading
            ? "Loading..."
            : `${filtered.length} patient${filtered.length !== 1 ? "s" : ""} found`
        }
        action={
          <button
            onClick={() => {
              setEditingPatient(null);
              setShowAddModal(true);
            }}
            className="flex items-center gap-2 bg-[#0F4C81] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#1a5f9e] transition-colors"
          >
            <Plus size={15} />
            Add Patient
          </button>
        }
      />

      <div className="relative max-w-sm">
        <Search
          size={14}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
        />
        <input
          type="text"
          value={search}
          onChange={handleSearch}
          placeholder="Search by name, ID or contact..."
          className="w-full h-10 pl-9 pr-3 text-sm border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
      </div>

      {loading ? (
        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 p-12 text-center">
          <div className="animate-spin w-8 h-8 border-2 border-[#0F4C81] border-t-transparent rounded-full mx-auto mb-3" />
          <p className="text-sm text-gray-400">Loading patients...</p>
        </div>
      ) : (
        <DataTable
          columns={columns}
          data={paginated}
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          emptyMessage="No patients found. Add your first patient to get started."
        />
      )}

      <Modal
        isOpen={showAddModal}
        onClose={handleModalClose}
        title={editingPatient ? "Edit Patient" : "Add New Patient"}
        size="lg"
      >
        <PatientForm
          initial={editingPatient}
          onSubmit={editingPatient ? handleEdit : handleAdd}
          onCancel={handleModalClose}
        />
      </Modal>

      <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="Delete Patient"
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
            {selectedPatient?.firstName} {selectedPatient?.lastName}
          </p>
          <p className="text-xs text-gray-400 mb-5">
            This action cannot be undone.
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

      <Modal
        isOpen={showViewModal}
        onClose={() => setShowViewModal(false)}
        title="Patient Details"
        size="md"
      >
        {selectedPatient && (
          <div className="space-y-4">
            <div className="flex items-center gap-3 pb-4 border-b border-gray-100 dark:border-gray-800">
              <div className="w-12 h-12 rounded-full bg-[#0F4C81] flex items-center justify-center text-white text-lg font-semibold">
                {selectedPatient.firstName.charAt(0)}
              </div>
              <div>
                <p className="font-semibold text-gray-900 dark:text-white">
                  {selectedPatient.firstName} {selectedPatient.lastName}
                </p>
                <p className="text-xs text-gray-400">
                  {selectedPatient.patientId}
                </p>
              </div>
              <div className="ml-auto">
                <Badge status={selectedPatient.status} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3 text-sm">
              {[
                { label: "Age", value: selectedPatient.age },
                { label: "Gender", value: selectedPatient.gender },
                { label: "Date of Birth", value: selectedPatient.dob || "—" },
                { label: "Contact", value: selectedPatient.contact },
                { label: "Email", value: selectedPatient.email || "—" },
                {
                  label: "Department",
                  value: selectedPatient.department || "—",
                },
                { label: "Address", value: selectedPatient.address || "—" },
              ].map(({ label, value }) => (
                <div key={label}>
                  <p className="text-xs text-gray-400 mb-0.5">{label}</p>
                  <p className="text-gray-800 dark:text-gray-200 font-medium">
                    {value}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
