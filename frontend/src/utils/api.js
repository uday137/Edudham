import axios from 'axios';

const API_URL = `${process.env.REACT_APP_BACKEND_URL || 'http://localhost:8000'}/api`;

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

  // Get unique locations and categories for filter dropdowns
  getFilterOptions: async () => {
    const response = await axios.get(`${API_URL}/universities/filter-options`);
    return response.data; // { locations: [...], categories: [...] }
  },

  // Homepage config
  getHomepageConfig: async () => {
    const response = await axios.get(`${API_URL}/homepage-config`);
    return response.data;
  },

  updateHomepageConfig: async (config) => {
    const response = await axios.put(`${API_URL}/homepage-config`, config, {
      headers: getAuthHeader(),
    });
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

  // Upload university photo (returns data URL)
  uploadUniversityPhoto: async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    const response = await axios.post(`${API_URL}/universities/upload-photo`, formData, {
      headers: {
        ...getAuthHeader(),
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data; // { photo_url: "data:image/...;base64,..." }
  },

  // Bulk upload universities via Excel
  bulkUploadUniversities: async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    const response = await axios.post(`${API_URL}/universities/bulk-upload`, formData, {
      headers: {
        ...getAuthHeader(),
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Download bulk upload template
  downloadBulkTemplate: async () => {
    const response = await axios.get(`${API_URL}/universities/bulk-template/download`, {
      headers: getAuthHeader(),
      responseType: 'blob',
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

  deleteApplication: async (id) => {
    const response = await axios.delete(`${API_URL}/applications/${id}`, {
      headers: getAuthHeader(),
    });
    return response.data;
  },

  exportApplicationsExcel: async () => {
    const response = await axios.get(`${API_URL}/applications/export/excel`, {
      headers: getAuthHeader(),
      responseType: 'blob',
    });
    return response.data;
  },

  exportUniversityApplicationsExcel: async (universityId) => {
    const response = await axios.get(
      `${API_URL}/universities/${universityId}/applications/export`,
      {
        headers: getAuthHeader(),
        responseType: 'blob',
      }
    );
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

  updateUser: async (userId, data) => {
    const response = await axios.put(`${API_URL}/admin/users/${userId}`, null, {
      headers: getAuthHeader(),
      params: data,
    });
    return response.data;
  },

  deleteUser: async (userId) => {
    const response = await axios.delete(`${API_URL}/admin/users/${userId}`, {
      headers: getAuthHeader(),
    });
    return response.data;
  },

  // Categories
  getCategories: async () => {
    const response = await axios.get(`${API_URL}/categories`);
    return response.data;
  },

  createCategory: async (data) => {
    const response = await axios.post(`${API_URL}/categories`, data, {
      headers: getAuthHeader(),
    });
    return response.data;
  },

  updateCategory: async (id, data) => {
    const response = await axios.put(`${API_URL}/categories/${id}`, data, {
      headers: getAuthHeader(),
    });
    return response.data;
  },

  deleteCategory: async (id) => {
    const response = await axios.delete(`${API_URL}/categories/${id}`, {
      headers: getAuthHeader(),
    });
    return response.data;
  },
};

export default api;