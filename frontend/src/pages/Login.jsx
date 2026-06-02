import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Activity, Eye, EyeOff } from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import toast from "react-hot-toast";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const { login } = useAuth();
  const navigate = useNavigate();

  // Client-side validation before hitting the API
  const validate = () => {
    const newErrors = {};
    if (!email) newErrors.email = "Email address is required";
    else if (!/\S+@\S+\.\S+/.test(email))
      newErrors.email = "Enter a valid email";
    if (!password) newErrors.password = "Password is required";
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);
    setErrors({});

    try {
      // TODO Phase 9: Replace with real API call
      // Temporary mock login for frontend development
      if (email === "admin@vydhya.com" && password === "Admin@123") {
        login({ name: "VYDHYA Admin", email }, "mock-jwt-token");
        toast.success("Welcome back!");
        navigate("/");
      } else {
        setErrors({ general: "Invalid email or password" });
      }
    } catch (err) {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left panel — brand */}
      <div className="hidden lg:flex w-5/12 bg-[#0F4C81] flex-col justify-center px-12">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 bg-white/15 rounded-xl flex items-center justify-center">
            <Activity size={20} className="text-white" />
          </div>
          <div>
            <h1 className="text-white text-2xl font-semibold tracking-tight">
              VYDHYA
            </h1>
            <p className="text-secondary text-xs">connects you</p>
          </div>
        </div>

        <h2 className="text-white text-3xl font-light leading-snug mb-4">
          Modern Healthcare
          <br />
          <span className="font-semibold">Management</span>
        </h2>
        <p className="text-white/60 text-sm leading-relaxed mb-10">
          A complete hospital management system for managing patients, doctors,
          and appointments in one place.
        </p>

        {/* Feature list */}
        <div className="space-y-3">
          {[
            "Patient & doctor records",
            "Appointment scheduling",
            "Live dashboard analytics",
            "Secure admin access",
          ].map((item) => (
            <div key={item} className="flex items-center gap-3">
              <div className="w-1.5 h-1.5 bg-accent rounded-full" />
              <span className="text-white/70 text-sm">{item}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Right panel — form */}
      <div className="flex-1 flex items-center justify-center px-6 bg-background-light dark:bg-background-dark">
        <div className="w-full max-w-sm">
          {/* Mobile logo */}
          <div className="flex items-center gap-2 mb-8 lg:hidden">
            <Activity size={20} className="text-primary" />
            <span className="text-primary font-semibold text-lg">VYDHYA</span>
          </div>

          <div className="mb-8">
            <span className="inline-block bg-blue-50 dark:bg-blue-900/20 text-secondary text-xs font-medium px-3 py-1 rounded-full mb-3">
              VYDHYA 2.0
            </span>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
              Welcome back
            </h2>
            <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
              Sign in to your HMS dashboard
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* General error */}
            {errors.general && (
              <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-700 dark:text-red-400 text-sm">
                {errors.general}
              </div>
            )}

            {/* Email */}
            <div>
              <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1.5 uppercase tracking-wide">
                Email address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@vydhya.com"
                className={`input-field ${errors.email ? "border-danger focus:ring-danger" : ""}`}
              />
              {errors.email && (
                <p className="text-danger text-xs mt-1">{errors.email}</p>
              )}
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1.5 uppercase tracking-wide">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className={`input-field pr-10 ${errors.password ? "border-danger focus:ring-danger" : ""}`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
              {errors.password && (
                <p className="text-danger text-xs mt-1">{errors.password}</p>
              )}
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full h-10 mt-2"
            >
              {loading ? "Signing in..." : "Sign in to Dashboard"}
            </button>
          </form>

          <p className="text-center text-xs text-gray-400 mt-8">
            Hospital Management System · Secure Admin Access
          </p>
        </div>
      </div>
    </div>
  );
}
