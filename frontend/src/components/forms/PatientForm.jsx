import { useState, useEffect } from "react";

// Empty form state — used when adding a new patient
const emptyForm = {
  firstName: "",
  lastName: "",
  age: "",
  gender: "",
  dob: "",
  contact: "",
  email: "",
  address: "",
  doctor: "",
  department: "",
  status: "Active",
};

export default function PatientForm({ initial = null, onSubmit, onCancel }) {
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState({});

  // If editing, pre-fill the form with existing patient data
  useEffect(() => {
    if (initial) {
      // Spread all fields including the numeric id
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setForm({
        firstName: initial.firstName || "",
        lastName: initial.lastName || "",
        age: String(initial.age || ""),
        gender: initial.gender || "",
        dob: initial.dob || "",
        contact: initial.contact || "",
        email: initial.email || "",
        address: initial.address || "",
        doctor: initial.doctor || "",
        department: initial.department || "",
        status: initial.status || "Active",
      });
    } else {
      setForm(emptyForm);
    }
  }, [initial]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    // Clear the error for this field as the user types
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validate = () => {
    const newErrors = {};
    if (!form.firstName.trim()) newErrors.firstName = "First name is required";
    if (!form.lastName.trim()) newErrors.lastName = "Last name is required";
    if (!form.age || isNaN(form.age) || form.age < 0 || form.age > 150)
      newErrors.age = "Enter a valid age";
    if (!form.gender) newErrors.gender = "Select a gender";
    if (!form.contact.trim()) newErrors.contact = "Contact number is required";
    else if (!/^\d{10}$/.test(form.contact))
      newErrors.contact = "Enter a valid 10-digit number";
    if (form.email && !/\S+@\S+\.\S+/.test(form.email))
      newErrors.email = "Enter a valid email address";
    if (!form.status) newErrors.status = "Select a status";
    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    onSubmit(form);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Section: Personal Information */}
      <div>
        <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3 pb-2 border-b border-gray-100 dark:border-gray-800">
          Personal Information
        </p>
        <div className="grid grid-cols-2 gap-3">
          {/* First Name */}
          <div>
            <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
              First Name <span className="text-danger">*</span>
            </label>
            <input
              name="firstName"
              value={form.firstName}
              onChange={handleChange}
              placeholder="e.g. Aarav"
              className={`input-field ${errors.firstName ? "border-danger focus:ring-danger" : ""}`}
            />
            {errors.firstName && (
              <p className="text-danger text-xs mt-1">{errors.firstName}</p>
            )}
          </div>

          {/* Last Name */}
          <div>
            <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
              Last Name <span className="text-danger">*</span>
            </label>
            <input
              name="lastName"
              value={form.lastName}
              onChange={handleChange}
              placeholder="e.g. Sharma"
              className={`input-field ${errors.lastName ? "border-danger focus:ring-danger" : ""}`}
            />
            {errors.lastName && (
              <p className="text-danger text-xs mt-1">{errors.lastName}</p>
            )}
          </div>

          {/* Age */}
          <div>
            <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
              Age <span className="text-danger">*</span>
            </label>
            <input
              name="age"
              type="number"
              value={form.age}
              onChange={handleChange}
              placeholder="e.g. 28"
              className={`input-field ${errors.age ? "border-danger focus:ring-danger" : ""}`}
            />
            {errors.age && (
              <p className="text-danger text-xs mt-1">{errors.age}</p>
            )}
          </div>

          {/* Gender */}
          <div>
            <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
              Gender <span className="text-danger">*</span>
            </label>
            <select
              name="gender"
              value={form.gender}
              onChange={handleChange}
              className={`input-field ${errors.gender ? "border-danger focus:ring-danger" : ""}`}
            >
              <option value="">Select gender</option>
              <option>Male</option>
              <option>Female</option>
              <option>Other</option>
            </select>
            {errors.gender && (
              <p className="text-danger text-xs mt-1">{errors.gender}</p>
            )}
          </div>

          {/* Date of Birth */}
          <div>
            <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
              Date of Birth
            </label>
            <input
              name="dob"
              type="date"
              value={form.dob}
              onChange={handleChange}
              className="input-field"
            />
          </div>

          {/* Status */}
          <div>
            <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
              Status <span className="text-danger">*</span>
            </label>
            <select
              name="status"
              value={form.status}
              onChange={handleChange}
              className="input-field"
            >
              <option>Active</option>
              <option>Under Observation</option>
              <option>Discharged</option>
            </select>
          </div>

          {/* Contact */}
          <div>
            <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
              Contact Number <span className="text-danger">*</span>
            </label>
            <input
              name="contact"
              value={form.contact}
              onChange={handleChange}
              placeholder="10-digit mobile number"
              className={`input-field ${errors.contact ? "border-danger focus:ring-danger" : ""}`}
            />
            {errors.contact && (
              <p className="text-danger text-xs mt-1">{errors.contact}</p>
            )}
          </div>

          {/* Email */}
          <div>
            <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
              Email Address
            </label>
            <input
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              placeholder="patient@email.com"
              className={`input-field ${errors.email ? "border-danger focus:ring-danger" : ""}`}
            />
            {errors.email && (
              <p className="text-danger text-xs mt-1">{errors.email}</p>
            )}
          </div>

          {/* Address — full width */}
          <div className="col-span-2">
            <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
              Address
            </label>
            <textarea
              name="address"
              value={form.address}
              onChange={handleChange}
              placeholder="Street address, city, state..."
              rows={2}
              className="input-field h-auto py-2 resize-none"
            />
          </div>
        </div>
      </div>

      {/* Section: Medical Assignment */}
      <div>
        <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3 pb-2 border-b border-gray-100 dark:border-gray-800">
          Medical Assignment
        </p>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
              Assigned Doctor
            </label>
            <input
              name="doctor"
              value={form.doctor}
              onChange={handleChange}
              placeholder="e.g. Dr. Priya Sharma"
              className="input-field"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
              Department
            </label>
            <input
              name="department"
              value={form.department}
              onChange={handleChange}
              placeholder="e.g. Cardiology"
              className="input-field"
            />
          </div>
        </div>
      </div>

      {/* Form actions */}
      <div className="flex justify-end gap-2 pt-2 border-t border-gray-100 dark:border-gray-800">
        <button type="button" onClick={onCancel} className="btn-secondary">
          Cancel
        </button>
        <button type="submit" className="btn-primary">
          {initial ? "Save Changes" : "Add Patient"}
        </button>
      </div>
    </form>
  );
}
