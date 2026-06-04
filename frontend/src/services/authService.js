import api from "./api";

export const authService = {
  // Sends credentials, receives JWT token + user info
  login: async (email, password) => {
    const response = await api.post("/auth/login", { email, password });
    return response.data;
  },
};

export default authService;
