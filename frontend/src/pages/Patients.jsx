import { useState, useMemo } from "react";
import { Plus, Search, Pencil, Trash2, Eye } from "lucide-react";
import PageHeader from "../components/common/PageHeader";
import DataTable from "../components/common/DataTable";
import Badge from "../components/common/Badge";
import Modal from "../components/common/Modal";
import PatientForm from "../components/forms/PatientForm";
import toast from "react-hot-toast";

// Mock data — replaced with real API calls in Phase 10
const initialPatients = [
  {
    id: "PAT-00001",
    firstName: "Aarav",
    lastName: "Sharma",
    age: 22,
    gender: "Male",
    contact: "8919438357",
    email: "aarav@email.com",
    doctor: "Dr. Ramesh Bandaru",
    department: "Dental",
    status: "Active",
    dob: "2003-05-22",
    address: "Chennai, TN",
  },
  {
    id: "PAT-00002",
    firstName: "Sita",
    lastName: "Patel",
    age: 17,
    gender: "Female",
    contact: "9876543210",
    email: "sita@email.com",
    doctor: "Dr. Priya Sharma",
    department: "Neurology",
    status: "Under Observation",
    dob: "2007-08-10",
    address: "Hyderabad, TS",
  },
  {
    id: "PAT-00003",
    firstName: "Ravi",
    lastName: "Kumar",
    age: 45,
    gender: "Male",
    contact: "8765432109",
    email: "ravi@email.com",
    doctor: "Dr. Ananya Iyer",
    department: "Cardiology",
    status: "Active",
    dob: "1979-03-15",
    address: "Bangalore, KA",
  },
  {
    id: "PAT-00004",
    firstName: "Meena",
    lastName: "Reddy",
    age: 32,
    gender: "Female",
    contact: "7654321098",
    email: "meena@email.com",
    doctor: "Dr. Kiran Rao",
    department: "Psychology",
    status: "Discharged",
    dob: "1992-11-20",
    address: "Mumbai, MH",
  },
  {
    id: "PAT-00005",
    firstName: "Arjun",
    lastName: "Nair",
    age: 28,
    gender: "Male",
    contact: "6543210987",
    email: "arjun@email.com",
    doctor: "Dr. Priya Sharma",
    department: "Orthopedics",
    status: "Active",
    dob: "1996-07-04",
    address: "Kochi, KL",
  },
  {
    id: "PAT-00006",
    firstName: "Divya",
    lastName: "Menon",
    age: 54,
    gender: "Female",
    contact: "5432109876",
    email: "divya@email.com",
    doctor: "Dr. Ramesh Bandaru",
    department: "Dental",
    status: "Active",
    dob: "1970-01-30",
    address: "Pune, MH",
  },
  {
    id: "PAT-00007",
    firstName: "Karthik",
    lastName: "Iyer",
    age: 19,
    gender: "Male",
    contact: "4321098765",
    email: "karthik@email.com",
    doctor: "Dr. Ananya Iyer",
    department: "General",
    status: "Active",
    dob: "2005-09-12",
    address: "Chennai, TN",
  },
  {
    id: "PAT-00008",
    firstName: "Priya",
    lastName: "Rao",
    age: 38,
    gender: "Female",
    contact: "3210987654",
    email: "priya@email.com",
    doctor: "Dr. Kiran Rao",
    department: "Dermatology",
    status: "Under Observation",
    dob: "1986-04-25",
    address: "Delhi, DL",
  },
];

const ITEMS_PER_PAGE = 5;

// Generates the next patient ID based on existing records
function generatePatientId(patients) {
  const max = patients.reduce((acc, p) => {
    const num = parseInt(p.id.replace("PAT-", ""));
    return num > acc ? num : acc;
  }, 0);
  return `PAT-${String(max + 1).padStart(5, "0")}`;
}

export default function Patients() {
  const [patients, setPatients] = useState(initialPatients);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  // Modal states
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [editingPatient, setEditingPatient] = useState(null);

  // Filter patients based on search input
  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return patients.filter(
      (p) =>
        `${p.firstName} ${p.lastName}`.toLowerCase().includes(q) ||
        p.id.toLowerCase().includes(q) ||
        p.contact.includes(q) ||
        p.department.toLowerCase().includes(q),
    );
  }, [patients, search]);

  // Paginate the filtered results
  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
  const paginated = filtered.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE,
  );

  // Reset to page 1 whenever search changes
  const handleSearch = (e) => {
    setSearch(e.target.value);
    setCurrentPage(1);
  };

  // Add new patient
  const handleAdd = (formData) => {
    const newPatient = {
      ...formData,
      id: generatePatientId(patients),
    };
    setPatients((prev) => [newPatient, ...prev]);
    setShowAddModal(false);
    toast.success(
      `${formData.firstName} ${formData.lastName} added successfully`,
    );
  };

  // Open edit modal pre-filled
  const handleEditOpen = (patient) => {
    setEditingPatient(patient);
    setShowAddModal(true);
  };

  // Save edits
  const handleEdit = (formData) => {
    setPatients((prev) =>
      prev.map((p) =>
        p.id === editingPatient.id ? { ...formData, id: editingPatient.id } : p,
      ),
    );
    setShowAddModal(false);
    setEditingPatient(null);
    toast.success("Patient record updated successfully");
  };

  // Open delete confirmation
  const handleDeleteOpen = (patient) => {
    setSelectedPatient(patient);
    setShowDeleteModal(true);
  };

  // Confirm delete
  const handleDeleteConfirm = () => {
    setPatients((prev) => prev.filter((p) => p.id !== selectedPatient.id));
    setShowDeleteModal(false);
    toast.success(
      `${selectedPatient.firstName} ${selectedPatient.lastName} removed`,
    );
    setSelectedPatient(null);
  };

  // Open view modal
  const handleView = (patient) => {
    setSelectedPatient(patient);
    setShowViewModal(true);
  };

  // Close add/edit modal and reset editing state
  const handleModalClose = () => {
    setShowAddModal(false);
    setEditingPatient(null);
  };

  // Table column definitions
  const columns = [
    {
      key: "id",
      label: "Patient",
      width: "220px",
      render: (row) => (
        <div>
          <p className="font-medium text-gray-900 dark:text-white">
            {row.firstName} {row.lastName}
          </p>
          <p className="text-xs text-gray-400 mt-0.5">{row.id}</p>
        </div>
      ),
    },
    {
      key: "contact",
      label: "Contact",
      render: (row) => <span className="font-mono text-xs">{row.contact}</span>,
    },
    {
      key: "doctor",
      label: "Doctor",
      render: (row) => (
        <div>
          <p className="text-sm">{row.doctor || "—"}</p>
          <p className="text-xs text-gray-400">{row.department || "—"}</p>
        </div>
      ),
    },
    {
      key: "age",
      label: "Age / Gender",
      render: (row) => (
        <span className="text-sm">
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
            title="View details"
            className="w-7 h-7 rounded-lg flex items-center justify-center text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-secondary transition-colors"
          >
            <Eye size={13} />
          </button>
          <button
            onClick={() => handleEditOpen(row)}
            title="Edit patient"
            className="w-7 h-7 rounded-lg flex items-center justify-center text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-primary transition-colors"
          >
            <Pencil size={13} />
          </button>
          <button
            onClick={() => handleDeleteOpen(row)}
            title="Delete patient"
            className="w-7 h-7 rounded-lg flex items-center justify-center text-gray-400 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-danger transition-colors"
          >
            <Trash2 size={13} />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="page-container">
      {/* Header */}
      <PageHeader
        title="Patients"
        subtitle={`${filtered.length} patient${filtered.length !== 1 ? "s" : ""} found`}
        action={
          <button
            onClick={() => {
              setEditingPatient(null);
              setShowAddModal(true);
            }}
            className="btn-primary flex items-center gap-2"
          >
            <Plus size={15} />
            Add Patient
          </button>
        }
      />

      {/* Search bar */}
      <div className="relative max-w-sm">
        <Search
          size={14}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
        />
        <input
          type="text"
          value={search}
          onChange={handleSearch}
          placeholder="Search by name, ID or contact..."
          className="input-field pl-9"
        />
      </div>

      {/* Table */}
      <DataTable
        columns={columns}
        data={paginated}
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
        emptyMessage="No patients found. Try a different search or add a new patient."
      />

      {/* Add / Edit Modal */}
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

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="Delete Patient"
        size="sm"
      >
        <div className="text-center">
          <div className="w-12 h-12 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-3">
            <Trash2 size={20} className="text-danger" />
          </div>
          <p className="text-sm text-gray-700 dark:text-gray-300 mb-1">
            Are you sure you want to delete
          </p>
          <p className="text-sm font-semibold text-gray-900 dark:text-white mb-1">
            {selectedPatient?.firstName} {selectedPatient?.lastName}
          </p>
          <p className="text-xs text-gray-400 mb-5">
            {selectedPatient?.id} · This action cannot be undone.
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => setShowDeleteModal(false)}
              className="btn-secondary flex-1"
            >
              Cancel
            </button>
            <button onClick={handleDeleteConfirm} className="btn-danger flex-1">
              Yes, Delete
            </button>
          </div>
        </div>
      </Modal>

      {/* View Details Modal */}
      <Modal
        isOpen={showViewModal}
        onClose={() => setShowViewModal(false)}
        title="Patient Details"
        size="md"
      >
        {selectedPatient && (
          <div className="space-y-4">
            <div className="flex items-center gap-3 pb-4 border-b border-gray-100 dark:border-gray-800">
              <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-white text-lg font-semibold">
                {selectedPatient.firstName.charAt(0)}
              </div>
              <div>
                <p className="font-semibold text-gray-900 dark:text-white">
                  {selectedPatient.firstName} {selectedPatient.lastName}
                </p>
                <p className="text-xs text-gray-400">{selectedPatient.id}</p>
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
                { label: "Doctor", value: selectedPatient.doctor || "—" },
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
