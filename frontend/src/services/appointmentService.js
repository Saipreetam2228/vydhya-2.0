import api from "./api";

export const appointmentService = {
  getAll: async () => {
    const response = await api.get("/appointments/");
    return response.data;
  },

  getById: async (id) => {
    const response = await api.get(`/appointments/${id}`);
    return response.data;
  },

  create: async (data) => {
    const response = await api.post("/appointments/", data);
    return response.data;
  },

  update: async (id, data) => {
    const response = await api.put(`/appointments/${id}`, data);
    return response.data;
  },

  delete: async (id) => {
    await api.delete(`/appointments/${id}`);
  },
};
