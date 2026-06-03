import { useState, useEffect } from "react";

const emptyForm = {
  patientName: "",
  doctorName: "",
  date: "",
  time: "",
  reason: "",
  status: "Scheduled",
};

// Pre-populated lists — replaced with API data in Phase 10
const PATIENT_OPTIONS = [
  "Aarav Sharma",
  "Sita Patel",
  "Ravi Kumar",
  "Meena Reddy",
  "Arjun Nair",
  "Divya Menon",
  "Karthik Iyer",
  "Priya Rao",
];

const DOCTOR_OPTIONS = [
  "Dr. Priya Sharma",
  "Dr. Ramesh Bandaru",
  "Dr. Ananya Iyer",
  "Dr. Kiran Rao",
  "Dr. Sathya Adapa",
  "Dr. Meera Pillai",
];

const STATUS_OPTIONS = ["Scheduled", "Completed", "Cancelled"];

export default function AppointmentForm({
  initial = null,
  onSubmit,
  onCancel,
}) {
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (initial) setForm(initial);
    else setForm(emptyForm);
  }, [initial]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validate = () => {
    const newErrors = {};
    if (!form.patientName) newErrors.patientName = "Select a patient";
    if (!form.doctorName) newErrors.doctorName = "Select a doctor";
    if (!form.date) newErrors.date = "Appointment date is required";
    else {
      // Prevent booking appointments in the past
      const selected = new Date(form.date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (!initial && selected < today)
        newErrors.date = "Cannot book an appointment in the past";
    }
    if (!form.time) newErrors.time = "Appointment time is required";
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

  // Reusable input class builder
  const inputClass = (field) =>
    `w-full h-10 px-3 text-sm border rounded-lg bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all ${
      errors[field] ? "border-red-400" : "border-gray-200 dark:border-gray-700"
    }`;

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Section: Participants */}
      <div>
        <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3 pb-2 border-b border-gray-100 dark:border-gray-800">
          Participants
        </p>
        <div className="grid grid-cols-2 gap-3">
          {/* Patient */}
          <div>
            <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
              Patient <span className="text-red-500">*</span>
            </label>
            <select
              name="patientName"
              value={form.patientName}
              onChange={handleChange}
              className={inputClass("patientName")}
            >
              <option value="">Select patient</option>
              {PATIENT_OPTIONS.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
            {errors.patientName && (
              <p className="text-red-500 text-xs mt-1">{errors.patientName}</p>
            )}
          </div>

          {/* Doctor */}
          <div>
            <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
              Doctor <span className="text-red-500">*</span>
            </label>
            <select
              name="doctorName"
              value={form.doctorName}
              onChange={handleChange}
              className={inputClass("doctorName")}
            >
              <option value="">Select doctor</option>
              {DOCTOR_OPTIONS.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
            {errors.doctorName && (
              <p className="text-red-500 text-xs mt-1">{errors.doctorName}</p>
            )}
          </div>
        </div>
      </div>

      {/* Section: Schedule */}
      <div>
        <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3 pb-2 border-b border-gray-100 dark:border-gray-800">
          Schedule
        </p>
        <div className="grid grid-cols-2 gap-3">
          {/* Date */}
          <div>
            <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
              Date <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              name="date"
              value={form.date}
              onChange={handleChange}
              className={inputClass("date")}
            />
            {errors.date && (
              <p className="text-red-500 text-xs mt-1">{errors.date}</p>
            )}
          </div>

          {/* Time */}
          <div>
            <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
              Time <span className="text-red-500">*</span>
            </label>
            <input
              type="time"
              name="time"
              value={form.time}
              onChange={handleChange}
              className={inputClass("time")}
            />
            {errors.time && (
              <p className="text-red-500 text-xs mt-1">{errors.time}</p>
            )}
          </div>

          {/* Status */}
          <div className="col-span-2">
            <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-2">
              Status
            </label>
            <div className="flex gap-3">
              {STATUS_OPTIONS.map((s) => {
                const colors = {
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
                  <label
                    key={s}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-sm cursor-pointer transition-colors flex-1 justify-center ${
                      form.status === s
                        ? colors[s]
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
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Section: Notes */}
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
          className="w-full px-3 py-2 text-sm border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all resize-none"
        />
      </div>

      {/* Actions */}
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
          {initial ? "Save Changes" : "Book Appointment"}
        </button>
      </div>
    </form>
  );
}
