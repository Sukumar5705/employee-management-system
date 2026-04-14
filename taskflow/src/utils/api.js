import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({ baseURL: BASE_URL, timeout: 12000 });

// Attach JWT to every request
api.interceptors.request.use(config => {
  const token = localStorage.getItem('tf_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Auto-logout on 401
api.interceptors.response.use(
  res => res,
  err => {
    if (err.response?.status === 401) {
      localStorage.removeItem('tf_token');
      localStorage.removeItem('tf_session');
      window.location.href = '/';
    }
    return Promise.reject(err);
  }
);

export const authAPI = {
  login: (email, password) => api.post('/auth/login', { email, password }),
  me:    ()                 => api.get('/auth/me'),
};

export const taskAPI = {
  myTasks:      ()                   => api.get('/tasks/my'),
  updateStatus: (taskId, status)     => api.patch(`/tasks/${taskId}/status`, { status }),
  create:       (payload)            => api.post('/tasks', payload),
  delete:       (empId, taskId)      => api.delete(`/tasks/${empId}/${taskId}`),
};

export const employeeAPI = {
  all:   () => api.get('/employees'),
  byId:  id => api.get(`/employees/${id}`),
};

export const performanceAPI = {
  all:   () => api.get('/performance'),
  byId:  id => api.get(`/performance/${id}`),
};

export default api;