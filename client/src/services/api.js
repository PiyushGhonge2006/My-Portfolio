import axios from 'axios'

const FALLBACK_API_BASE = 'https://my-portfolio-tnri.onrender.com/api'

const apiUrl = (import.meta.env.VITE_API_URL || '').trim().replace(/\/+$/, '')

function resolveBaseUrl() {
  if (apiUrl) return apiUrl.endsWith('/api') ? apiUrl : `${apiUrl}/api`
  if (import.meta.env.DEV) return '/api'
  return FALLBACK_API_BASE
}

const api = axios.create({ baseURL: resolveBaseUrl() })

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('portfolio-admin-token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export default api