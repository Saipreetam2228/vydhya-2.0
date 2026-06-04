import api from "./api";

export const doctorService = {
  getAll: async () => {
    const response = await api.get("/doctors/");
    return response.data;
  },

  getById: async (id) => {
    const response = await api.get(`/doctors/${id}`);
    return response.data;
  },

  create: async (data) => {
    const response = await api.post("/doctors/", data);
    return response.data;
  },

  update: async (id, data) => {
    const response = await api.put(`/doctors/${id}`, data);
    return response.data;
  },

  delete: async (id) => {
    await api.delete(`/doctors/${id}`);
  },
};
