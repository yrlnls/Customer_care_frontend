import axios from 'axios';

const API_BASE_URL = 'https://capital-customer-care.onrender.com/api';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    subject: 'default',
  },
});

// Add request interceptor to include auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Add response interceptor to handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('access_token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

/* ---------------- Authentication API ---------------- */
export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  getProfile: () => api.get('/auth/profile'),
  updateProfile: (userData) => api.put('/auth/profile', userData),
};

/* ---------------- Tickets API ---------------- */
export const ticketsAPI = {
  getAll: () => api.get('/tickets/'),
  getById: (id) => api.get(`/tickets/${id}`),
  create: (ticketData) => api.post('/tickets/', ticketData),
  update: (id, ticketData) => api.put(`/tickets/${id}`, ticketData),
  delete: (id) => api.delete(`/tickets/${id}`),
  addComment: (id, comment) => api.post(`/tickets/${id}/comments`, { comment }),
};

/* ---------------- Clients API ---------------- */
export const clientsAPI = {
  getAll: () => api.get('/clients/'),
  getById: (id) => api.get(`/clients/${id}`),
  create: (clientData) => api.post('/clients/', clientData),
  update: (id, clientData) => api.put(`/clients/${id}`, clientData),
  delete: (id) => api.delete(`/clients/${id}`),
};

/* ---------------- Users API ---------------- */
export const usersAPI = {
  getAll: () => api.get('/users/'),
  create: (userData) => api.post('/users/', userData),
  update: (id, userData) => api.put(`/users/${id}`, userData),
  delete: (id) => api.delete(`/users/${id}`),
  getTechnicians: () => api.get('/users/technicians'),
};

/* ---------------- Sites API ---------------- */
export const sitesAPI = {
  getAll: () => api.get('/sites/'),
  create: (siteData) => api.post('/sites/', siteData),
  update: (id, siteData) => api.put(`/sites/${id}`, siteData),
  delete: (id) => api.delete(`/sites/${id}`),
};

/* ---------------- Routers API ---------------- */
export const routersAPI = {
  getAll: () => api.get('/routers/'),
  create: (routerData) => api.post('/routers/', routerData),
  update: (id, routerData) => api.put(`/routers/${id}`, routerData),
  delete: (id) => api.delete(`/routers/${id}`),
  updateStatus: (id, status) => api.put(`/routers/${id}/status`, { status }),
};

/* ---------------- Analytics API ---------------- */
export const analyticsAPI = {
  getDashboard: () => api.get('/analytics/dashboard'),
  getActivityLog: () =>
    api.get('/analytics/dashboard').then((res) => ({
      data: res.data.recent_activities,
    })),
  getPerformance: (days = 30) =>
    api.get(`/analytics/performance?days=${days}`),
  exportCSV: (type = 'tickets') =>
    api.get(`/analytics/reports/csv?type=${type}`, {
      responseType: 'blob',
    }),
};

export default api;
