import axios from "axios";

// Base URL comes from the .env file
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor — automatically attaches the JWT token
// to every outgoing request so we never forget to add it manually
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("vydhya_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// Response interceptor — handles expired tokens globally
// If any request gets a 401, clear storage and redirect to login
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("vydhya_token");
      localStorage.removeItem("vydhya_user");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  },
);

export default api;
