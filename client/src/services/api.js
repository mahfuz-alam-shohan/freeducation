import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8787'

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Add request interceptor to include auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('freeducation_token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Add response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('freeducation_token')
      window.location.href = '/'
    }
    return Promise.reject(error)
  }
)

// Auth API
export const authAPI = {
  checkInitialization: async () => {
    const response = await api.get('/api/auth/check-init')
    return response.data
  },

  registerFirstAdmin: async (adminData) => {
    const response = await api.post('/api/auth/register-first-admin', adminData)
    return response.data
  },

  login: async (email, password) => {
    const response = await api.post('/api/auth/login', { email, password })
    return response.data
  },

  logout: async () => {
    const response = await api.post('/api/auth/logout')
    return response.data
  },

  getProfile: async () => {
    const response = await api.get('/api/admin/profile')
    return response.data
  }
}

// Admin API
export const adminAPI = {
  createAdmin: async (adminData) => {
    const response = await api.post('/api/admin/create', adminData)
    return response.data
  },

  getAdminsList: async () => {
    const response = await api.get('/api/admin/list')
    return response.data
  },

  getProfile: async () => {
    const response = await api.get('/api/admin/profile')
    return response.data
  }
}

export default api
