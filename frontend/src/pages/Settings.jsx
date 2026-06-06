import { useState, useContext } from "react";
import {
  User,
  Lock,
  Palette,
  Check,
  Eye,
  EyeOff,
  Sun,
  Moon,
} from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import { ThemeContext } from "../context/ThemeContext";
import toast from "react-hot-toast";

// Reusable section card wrapper
function SettingsCard({ icon: Icon, title, subtitle, children }) {
  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 overflow-hidden">
      <div className="flex items-start gap-3 px-5 py-4 border-b border-gray-100 dark:border-gray-800">
        <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center flex-shrink-0 mt-0.5">
          <Icon size={15} className="text-[#0F4C81]" />
        </div>
        <div>
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
            {title}
          </h3>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
            {subtitle}
          </p>
        </div>
      </div>
      <div className="p-5">{children}</div>
    </div>
  );
}

// Reusable form field
function Field({ label, error, children }) {
  return (
    <div>
      <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1.5">
        {label}
      </label>
      {children}
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  );
}

// Input class builder
const inputCls = (hasError) =>
  `w-full h-10 px-3 text-sm border rounded-lg bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all ${
    hasError ? "border-red-400" : "border-gray-200 dark:border-gray-700"
  }`;

export default function Settings() {
  const { user, login, token } = useAuth();
  const { isDark, toggleTheme } = useContext(ThemeContext);

  // Profile form state
  const [profile, setProfile] = useState({
    name: user?.name || "VYDHYA Admin",
    email: user?.email || "admin@vydhya.com",
  });
  const [profileErrors, setProfileErrors] = useState({});
  const [profileSaved, setProfileSaved] = useState(false);

  // Password form state
  const [passwords, setPasswords] = useState({
    current: "",
    newPass: "",
    confirm: "",
  });
  const [passwordErrors, setPasswordErrors] = useState({});
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  // ─── Profile handlers ───────────────────────────────────────────

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
    if (profileErrors[name])
      setProfileErrors((prev) => ({ ...prev, [name]: "" }));
    setProfileSaved(false);
  };

  const validateProfile = () => {
    const errors = {};
    if (!profile.name.trim()) errors.name = "Name is required";
    if (!profile.email.trim()) errors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(profile.email))
      errors.email = "Enter a valid email address";
    return errors;
  };

  const handleProfileSubmit = (e) => {
    e.preventDefault();
    const errors = validateProfile();
    if (Object.keys(errors).length > 0) {
      setProfileErrors(errors);
      return;
    }
    // Update the auth context so the sidebar + topbar reflect the new name
    login({ name: profile.name, email: profile.email }, token);
    setProfileSaved(true);
    toast.success("Profile updated successfully");
  };

  // ─── Password handlers ───────────────────────────────────────────

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswords((prev) => ({ ...prev, [name]: value }));
    if (passwordErrors[name])
      setPasswordErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validatePassword = () => {
    const errors = {};
    // TODO Phase 11: Replace mock check with real API verification
    if (!passwords.current) errors.current = "Current password is required";
    else if (passwords.current !== "Admin@123")
      errors.current = "Current password is incorrect";
    if (!passwords.newPass) errors.newPass = "New password is required";
    else if (passwords.newPass.length < 8)
      errors.newPass = "Password must be at least 8 characters";
    else if (!/[A-Z]/.test(passwords.newPass))
      errors.newPass = "Must contain at least one uppercase letter";
    else if (!/[0-9]/.test(passwords.newPass))
      errors.newPass = "Must contain at least one number";
    if (!passwords.confirm) errors.confirm = "Please confirm your new password";
    else if (passwords.newPass !== passwords.confirm)
      errors.confirm = "Passwords do not match";
    return errors;
  };

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    const errors = validatePassword();
    if (Object.keys(errors).length > 0) {
      setPasswordErrors(errors);
      return;
    }
    setPasswords({ current: "", newPass: "", confirm: "" });
    toast.success("Password changed successfully");
  };

  // ─── Password strength indicator ────────────────────────────────

  const getPasswordStrength = (pass) => {
    if (!pass) return { score: 0, label: "", color: "" };
    let score = 0;
    if (pass.length >= 8) score++;
    if (/[A-Z]/.test(pass)) score++;
    if (/[0-9]/.test(pass)) score++;
    if (/[^A-Za-z0-9]/.test(pass)) score++;
    const levels = [
      { score: 1, label: "Weak", color: "bg-red-400" },
      { score: 2, label: "Fair", color: "bg-amber-400" },
      { score: 3, label: "Good", color: "bg-blue-400" },
      { score: 4, label: "Strong", color: "bg-green-500" },
    ];
    return levels[score - 1] || { score: 0, label: "", color: "" };
  };

  const strength = getPasswordStrength(passwords.newPass);

  return (
    <div className="p-6 space-y-5 max-w-2xl">
      {/* Page title */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
          Settings
        </h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
          Manage your account preferences and security settings.
        </p>
      </div>

      {/* ── Profile Section ─────────────────────────────────────── */}
      <SettingsCard
        icon={User}
        title="Profile Information"
        subtitle="Update your display name and email address"
      >
        <form onSubmit={handleProfileSubmit} className="space-y-4">
          {/* Avatar preview */}
          <div className="flex items-center gap-4 pb-4 border-b border-gray-100 dark:border-gray-800">
            <div className="w-14 h-14 rounded-full bg-[#0F4C81] flex items-center justify-center text-white text-2xl font-semibold flex-shrink-0">
              {profile.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                {profile.name}
              </p>
              <p className="text-xs text-gray-400 mt-0.5">{profile.email}</p>
              <p className="text-xs text-green-600 dark:text-green-400 mt-1 font-medium">
                Administrator
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Field label="Display Name" error={profileErrors.name}>
              <input
                name="name"
                value={profile.name}
                onChange={handleProfileChange}
                placeholder="Your name"
                className={inputCls(!!profileErrors.name)}
              />
            </Field>

            <Field label="Email Address" error={profileErrors.email}>
              <input
                name="email"
                type="email"
                value={profile.email}
                onChange={handleProfileChange}
                placeholder="admin@vydhya.com"
                className={inputCls(!!profileErrors.email)}
              />
            </Field>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className="flex items-center gap-2 px-4 py-2 bg-[#0F4C81] text-white text-sm font-medium rounded-lg hover:bg-[#1a5f9e] transition-colors"
            >
              {profileSaved && <Check size={14} />}
              {profileSaved ? "Saved!" : "Save Profile"}
            </button>
          </div>
        </form>
      </SettingsCard>

      {/* ── Security Section ─────────────────────────────────────── */}
      <SettingsCard
        icon={Lock}
        title="Change Password"
        subtitle="Use a strong password with letters, numbers and symbols"
      >
        <form onSubmit={handlePasswordSubmit} className="space-y-4">
          {/* Current password */}
          <Field label="Current Password" error={passwordErrors.current}>
            <div className="relative">
              <input
                name="current"
                type={showCurrent ? "text" : "password"}
                value={passwords.current}
                onChange={handlePasswordChange}
                placeholder="Enter current password"
                className={`${inputCls(!!passwordErrors.current)} pr-10`}
              />
              <button
                type="button"
                onClick={() => setShowCurrent(!showCurrent)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showCurrent ? <EyeOff size={14} /> : <Eye size={14} />}
              </button>
            </div>
          </Field>

          {/* New password */}
          <Field label="New Password" error={passwordErrors.newPass}>
            <div className="relative">
              <input
                name="newPass"
                type={showNew ? "text" : "password"}
                value={passwords.newPass}
                onChange={handlePasswordChange}
                placeholder="Min. 8 characters"
                className={`${inputCls(!!passwordErrors.newPass)} pr-10`}
              />
              <button
                type="button"
                onClick={() => setShowNew(!showNew)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showNew ? <EyeOff size={14} /> : <Eye size={14} />}
              </button>
            </div>

            {/* Password strength meter */}
            {passwords.newPass && (
              <div className="mt-2">
                <div className="flex gap-1 mb-1">
                  {[1, 2, 3, 4].map((level) => (
                    <div
                      key={level}
                      className={`h-1 flex-1 rounded-full transition-all duration-300 ${
                        strength.score >= level
                          ? strength.color
                          : "bg-gray-100 dark:bg-gray-800"
                      }`}
                    />
                  ))}
                </div>
                {strength.label && (
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Strength:{" "}
                    <span
                      className={`font-medium ${
                        strength.score === 4
                          ? "text-green-600"
                          : strength.score === 3
                            ? "text-blue-500"
                            : strength.score === 2
                              ? "text-amber-500"
                              : "text-red-500"
                      }`}
                    >
                      {strength.label}
                    </span>
                  </p>
                )}
              </div>
            )}
          </Field>

          {/* Confirm password */}
          <Field label="Confirm New Password" error={passwordErrors.confirm}>
            <div className="relative">
              <input
                name="confirm"
                type={showConfirm ? "text" : "password"}
                value={passwords.confirm}
                onChange={handlePasswordChange}
                placeholder="Re-enter new password"
                className={`${inputCls(!!passwordErrors.confirm)} pr-10`}
              />
              <button
                type="button"
                onClick={() => setShowConfirm(!showConfirm)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showConfirm ? <EyeOff size={14} /> : <Eye size={14} />}
              </button>
            </div>
          </Field>

          {/* Password requirements hint */}
          <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-3">
            <p className="text-xs text-gray-500 dark:text-gray-400 font-medium mb-2">
              Password requirements:
            </p>
            <ul className="space-y-1">
              {[
                {
                  rule: passwords.newPass.length >= 8,
                  text: "At least 8 characters",
                },
                {
                  rule: /[A-Z]/.test(passwords.newPass),
                  text: "One uppercase letter",
                },
                { rule: /[0-9]/.test(passwords.newPass), text: "One number" },
                {
                  rule: /[^A-Za-z0-9]/.test(passwords.newPass),
                  text: "One special character (recommended)",
                },
              ].map(({ rule, text }) => (
                <li key={text} className="flex items-center gap-2 text-xs">
                  <span
                    className={`w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 ${
                      rule
                        ? "bg-green-100 dark:bg-green-900/30 text-green-600"
                        : "bg-gray-100 dark:bg-gray-800 text-gray-400"
                    }`}
                  >
                    {rule ? <Check size={10} /> : "·"}
                  </span>
                  <span
                    className={
                      rule
                        ? "text-green-700 dark:text-green-400"
                        : "text-gray-500 dark:text-gray-400"
                    }
                  >
                    {text}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => {
                setPasswords({ current: "", newPass: "", confirm: "" });
                setPasswordErrors({});
              }}
              className="px-4 py-2 text-sm border border-gray-200 dark:border-gray-700 rounded-lg text-gray-600 dark:text-gray-400 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-[#0F4C81] text-white text-sm font-medium rounded-lg hover:bg-[#1a5f9e] transition-colors"
            >
              Update Password
            </button>
          </div>
        </form>
      </SettingsCard>

      {/* ── Appearance Section ───────────────────────────────────── */}
      <SettingsCard
        icon={Palette}
        title="Appearance"
        subtitle="Customise how VYDHYA looks on your device"
      >
        <div className="space-y-4">
          {/* Theme toggle */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center ${isDark ? "bg-gray-800" : "bg-amber-50"}`}
              >
                {isDark ? (
                  <Moon size={18} className="text-blue-400" />
                ) : (
                  <Sun size={18} className="text-amber-500" />
                )}
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  {isDark ? "Dark Mode" : "Light Mode"}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {isDark
                    ? "Easy on the eyes in low light"
                    : "Clean and bright interface"}
                </p>
              </div>
            </div>

            {/* Toggle switch */}
            <button
              onClick={toggleTheme}
              className={`relative w-12 h-6 rounded-full transition-colors duration-300 focus:outline-none ${
                isDark ? "bg-[#0F4C81]" : "bg-gray-200"
              }`}
            >
              <span
                className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-sm transition-transform duration-300 ${
                  isDark ? "translate-x-6" : "translate-x-0"
                }`}
              />
            </button>
          </div>

          {/* Theme preview cards */}
          <div className="grid grid-cols-2 gap-3 pt-2">
            <div
              onClick={() => isDark && toggleTheme()}
              className={`rounded-xl border-2 p-3 cursor-pointer transition-all ${
                !isDark
                  ? "border-[#0F4C81]"
                  : "border-gray-200 dark:border-gray-700 hover:border-gray-300"
              }`}
            >
              {/* Light mode mini preview */}
              <div className="bg-gray-50 rounded-lg p-2 mb-2 space-y-1.5">
                <div className="flex gap-1">
                  <div className="w-2 h-2 rounded-sm bg-[#0F4C81]" />
                  <div className="h-2 flex-1 bg-gray-200 rounded" />
                </div>
                <div className="h-1.5 bg-gray-200 rounded w-3/4" />
                <div className="h-1.5 bg-gray-200 rounded w-1/2" />
              </div>
              <div className="flex items-center justify-between">
                <p className="text-xs font-medium text-gray-700 dark:text-gray-300">
                  Light
                </p>
                {!isDark && <Check size={12} className="text-[#0F4C81]" />}
              </div>
            </div>

            <div
              onClick={() => !isDark && toggleTheme()}
              className={`rounded-xl border-2 p-3 cursor-pointer transition-all ${
                isDark
                  ? "border-[#0F4C81]"
                  : "border-gray-200 dark:border-gray-700 hover:border-gray-300"
              }`}
            >
              {/* Dark mode mini preview */}
              <div className="bg-gray-900 rounded-lg p-2 mb-2 space-y-1.5">
                <div className="flex gap-1">
                  <div className="w-2 h-2 rounded-sm bg-[#4A90E2]" />
                  <div className="h-2 flex-1 bg-gray-700 rounded" />
                </div>
                <div className="h-1.5 bg-gray-700 rounded w-3/4" />
                <div className="h-1.5 bg-gray-700 rounded w-1/2" />
              </div>
              <div className="flex items-center justify-between">
                <p className="text-xs font-medium text-gray-700 dark:text-gray-300">
                  Dark
                </p>
                {isDark && <Check size={12} className="text-[#0F4C81]" />}
              </div>
            </div>
          </div>
        </div>
      </SettingsCard>

      {/* App info footer */}
      <div className="text-center py-4">
        <p className="text-xs text-gray-400 dark:text-gray-500">
          VYDHYA 2.0 — Hospital Management System
        </p>
        <p className="text-xs text-gray-300 dark:text-gray-600 mt-1">
          Built with React · FastAPI · MySQL
        </p>
      </div>
    </div>
  );
}
