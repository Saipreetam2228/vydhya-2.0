import api from "./api";

export const patientService = {
  // Fetch all patients
  getAll: async () => {
    const response = await api.get("/patients/");
    return response.data;
  },

  // Fetch single patient by numeric ID
  getById: async (id) => {
    const response = await api.get(`/patients/${id}`);
    return response.data;
  },

  // Create new patient
  create: async (data) => {
    const response = await api.post("/patients/", data);
    return response.data;
  },

  // Update existing patient
  update: async (id, data) => {
    const response = await api.put(`/patients/${id}`, data);
    return response.data;
  },

  // Delete patient
  delete: async (id) => {
    await api.delete(`/patients/${id}`);
  },
};
