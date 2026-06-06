import { useState, useEffect } from "react";

const emptyForm = {
  firstName: "",
  lastName: "",
  specialty: "",
  experience: "",
  contact: "",
  email: "",
  status: "Active",
};

const SPECIALTIES = [
  "Cardiology",
  "Dental",
  "Dermatology",
  "General Medicine",
  "Neurology",
  "Orthopedics",
  "Pediatrics",
  "Psychology",
  "Radiology",
  "Surgery",
];

export default function DoctorForm({ initial = null, onSubmit, onCancel }) {
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initial) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setForm({
        firstName: initial.firstName || "",
        lastName: initial.lastName || "",
        specialty: initial.specialty || "",
        experience: String(initial.experience || ""),
        contact: initial.contact || "",
        email: initial.email || "",
        status: initial.status || "Active",
      });
    } else {
      setForm(emptyForm);
    }
  }, [initial]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!form.firstName.trim()) newErrors.firstName = "First name is required";
    if (!form.lastName.trim()) newErrors.lastName = "Last name is required";
    if (!form.specialty) newErrors.specialty = "Specialty is required";
    if (
      !form.experience ||
      isNaN(form.experience) ||
      Number(form.experience) < 0
    )
      newErrors.experience = "Enter valid years of experience";
    if (!form.contact.trim()) newErrors.contact = "Contact number is required";
    else if (!/^\d{10}$/.test(form.contact))
      newErrors.contact = "Enter a valid 10-digit number";
    if (!form.email.trim()) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(form.email))
      newErrors.email = "Enter a valid email address";
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
          <div>
            <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
              First Name <span className="text-red-500">*</span>
            </label>
            <input
              name="firstName"
              value={form.firstName}
              onChange={handleChange}
              placeholder="e.g. Priya"
              className={`w-full h-10 px-3 text-sm border rounded-lg bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all ${
                errors.firstName
                  ? "border-red-400"
                  : "border-gray-200 dark:border-gray-700"
              }`}
            />
            {errors.firstName && (
              <p className="text-red-500 text-xs mt-1">{errors.firstName}</p>
            )}
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
              Last Name <span className="text-red-500">*</span>
            </label>
            <input
              name="lastName"
              value={form.lastName}
              onChange={handleChange}
              placeholder="e.g. Sharma"
              className={`w-full h-10 px-3 text-sm border rounded-lg bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all ${
                errors.lastName
                  ? "border-red-400"
                  : "border-gray-200 dark:border-gray-700"
              }`}
            />
            {errors.lastName && (
              <p className="text-red-500 text-xs mt-1">{errors.lastName}</p>
            )}
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
              Contact Number <span className="text-red-500">*</span>
            </label>
            <input
              name="contact"
              value={form.contact}
              onChange={handleChange}
              placeholder="10-digit mobile number"
              className={`w-full h-10 px-3 text-sm border rounded-lg bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all ${
                errors.contact
                  ? "border-red-400"
                  : "border-gray-200 dark:border-gray-700"
              }`}
            />
            {errors.contact && (
              <p className="text-red-500 text-xs mt-1">{errors.contact}</p>
            )}
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
              Email Address <span className="text-red-500">*</span>
            </label>
            <input
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              placeholder="doctor@hospital.com"
              className={`w-full h-10 px-3 text-sm border rounded-lg bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all ${
                errors.email
                  ? "border-red-400"
                  : "border-gray-200 dark:border-gray-700"
              }`}
            />
            {errors.email && (
              <p className="text-red-500 text-xs mt-1">{errors.email}</p>
            )}
          </div>
        </div>
      </div>

      {/* Section: Professional Details */}
      <div>
        <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3 pb-2 border-b border-gray-100 dark:border-gray-800">
          Professional Details
        </p>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
              Specialty <span className="text-red-500">*</span>
            </label>
            <select
              name="specialty"
              value={form.specialty}
              onChange={handleChange}
              className={`w-full h-10 px-3 text-sm border rounded-lg bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all ${
                errors.specialty
                  ? "border-red-400"
                  : "border-gray-200 dark:border-gray-700"
              }`}
            >
              <option value="">Select specialty</option>
              {SPECIALTIES.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
            {errors.specialty && (
              <p className="text-red-500 text-xs mt-1">{errors.specialty}</p>
            )}
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
              Experience (Years) <span className="text-red-500">*</span>
            </label>
            <input
              name="experience"
              type="number"
              min="0"
              max="60"
              value={form.experience}
              onChange={handleChange}
              placeholder="e.g. 8"
              className={`w-full h-10 px-3 text-sm border rounded-lg bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all ${
                errors.experience
                  ? "border-red-400"
                  : "border-gray-200 dark:border-gray-700"
              }`}
            />
            {errors.experience && (
              <p className="text-red-500 text-xs mt-1">{errors.experience}</p>
            )}
          </div>

          {/* Status radio buttons — full width */}
          <div className="col-span-2">
            <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-2">
              Status
            </label>
            <div className="flex gap-3">
              {["Active", "On Leave", "Inactive"].map((s) => (
                <label
                  key={s}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg border text-sm cursor-pointer transition-colors flex-1 justify-center ${
                    form.status === s
                      ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 font-medium"
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
                    className={`w-2 h-2 rounded-full flex-shrink-0 ${
                      s === "Active"
                        ? "bg-green-500"
                        : s === "On Leave"
                          ? "bg-amber-400"
                          : "bg-gray-400"
                    }`}
                  />
                  {s}
                </label>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Form Actions */}
      <div className="flex justify-end gap-2 pt-2 border-t border-gray-100 dark:border-gray-800">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-sm border border-gray-200 dark:border-gray-700 rounded-lg text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 text-sm bg-[#0F4C81] text-white rounded-lg hover:bg-[#1a5f9e] transition-colors font-medium"
        >
          {initial ? "Save Changes" : "Add Doctor"}
        </button>
      </div>
    </form>
  );
}
