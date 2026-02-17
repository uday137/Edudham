import axios from 'axios';

const API_URL = `${process.env.REACT_APP_BACKEND_URL}/api`;

const getAuthHeader = () => {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const api = {
  // Universities
  getUniversities: async (filters = {}) => {
    const params = new URLSearchParams();
    Object.keys(filters).forEach((key) => {
      if (filters[key] !== null && filters[key] !== undefined && filters[key] !== '') {
        params.append(key, filters[key]);
      }
    });
    const response = await axios.get(`${API_URL}/universities?${params.toString()}`);
    return response.data;
  },

  getUniversity: async (id) => {
    const response = await axios.get(`${API_URL}/universities/${id}`);
    return response.data;
  },

  createUniversity: async (data) => {
    const response = await axios.post(`${API_URL}/universities`, data, {
      headers: getAuthHeader(),
    });
    return response.data;
  },

  updateUniversity: async (id, data) => {
    const response = await axios.put(`${API_URL}/universities/${id}`, data, {
      headers: getAuthHeader(),
    });
    return response.data;
  },

  deleteUniversity: async (id) => {
    const response = await axios.delete(`${API_URL}/universities/${id}`, {
      headers: getAuthHeader(),
    });
    return response.data;
  },

  // Applications
  createApplication: async (data) => {
    const response = await axios.post(`${API_URL}/applications`, data);
    return response.data;
  },

  getApplications: async () => {
    const response = await axios.get(`${API_URL}/applications`, {
      headers: getAuthHeader(),
    });
    return response.data;
  },

  getApplicationsByUniversity: async (universityId) => {
    const response = await axios.get(
      `${API_URL}/applications/university/${universityId}`,
      {
        headers: getAuthHeader(),
      }
    );
    return response.data;
  },

  updateApplicationStatus: async (id, status) => {
    const response = await axios.put(
      `${API_URL}/applications/${id}/status?status=${status}`,
      {},
      {
        headers: getAuthHeader(),
      }
    );
    return response.data;
  },

  exportApplicationsExcel: async () => {
    const response = await axios.get(`${API_URL}/applications/export/excel`, {
      headers: getAuthHeader(),
      responseType: 'blob',
    });
    return response.data;
  },

  // Auth
  requestOTP: async (email) => {
    const response = await axios.post(`${API_URL}/auth/request-otp`, { email });
    return response.data;
  },

  verifyOTP: async (email, otp, new_password) => {
    const response = await axios.post(`${API_URL}/auth/verify-otp`, {
      email,
      otp,
      new_password,
    });
    return response.data;
  },

  // Admin
  getAdminStats: async () => {
    const response = await axios.get(`${API_URL}/admin/stats`, {
      headers: getAuthHeader(),
    });
    return response.data;
  },

  createUser: async (data) => {
    const response = await axios.post(`${API_URL}/admin/users`, data, {
      headers: getAuthHeader(),
    });
    return response.data;
  },

  getAllUsers: async () => {
    const response = await axios.get(`${API_URL}/admin/users`, {
      headers: getAuthHeader(),
    });
    return response.data;
  },
};

export default api;