import axios from 'axios';

// Environment Configuration
const API_BASE_URL = process.env.NODE_ENV === 'production'
  ? 'https://travel-ai-ii.onrender.com'
  : 'http://localhost:5000';

// Axios Instance Configuration
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
    'X-Requested-With': 'XMLHttpRequest'
  },
  withCredentials: true
});

// Request Interceptor
api.interceptors.request.use(
  (config) => {
    if (process.env.NODE_ENV !== 'production') {
      console.log(`[API] ${config.method?.toUpperCase()} ${config.url}`, {
        params: config.params,
        data: config.data
      });
    }
    
    // Add auth token if exists
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    console.error('[API] Request Error:', error);
    return Promise.reject(error);
  }
);

// Response Interceptor
api.interceptors.response.use(
  (response) => {
    if (process.env.NODE_ENV !== 'production') {
      console.log(`[API] Response ${response.status} ${response.config.url}`, response.data);
    }
    return response;
  },
  (error) => {
    const errorData = {
      message: error.message,
      code: error.code,
      status: error.response?.status,
      url: error.config?.url,
      method: error.config?.method
    };

    console.error('[API] Response Error:', errorData);

    // Enhanced error handling
    if (error.response) {
      // Server responded with error status
      const serverError = {
        message: error.response.data?.error || `Server Error (${error.response.status})`,
        details: error.response.data?.details,
        status: error.response.status
      };
      return Promise.reject(serverError);
    } else if (error.request) {
      // No response received
      return Promise.reject({
        message: 'Network Error: No response from server',
        isNetworkError: true
      });
    } else {
      // Request setup error
      return Promise.reject({
        message: 'Request Error: Invalid request configuration'
      });
    }
  }
);

// API Services
export const apiService = {
  chat: {
    send: (message, conversation = []) => 
      api.post('/api/chat', { message, conversation })
  },
  attractions: {
    get: (location, params = {}) =>
      api.get(`/api/attractions/${encodeURIComponent(location)}`, { params })
  },
  images: {
    search: (query, params = {}) =>
      api.get(`/api/images/${encodeURIComponent(query)}`, { params })
  },
  weather: {
    forecast: (location, days = 7) =>
      api.get(`/api/weather/${encodeURIComponent(location)}`, { 
        params: { days } 
      })
  },
  travel: {
    flights: (params) => api.get('/api/flights', { params }),
    hotels: (params) => api.get('/api/hotels', { params })
  },
  itinerary: {
    generate: (data) => api.post('/api/generate-itinerary', data),
    save: (id, data) => api.put(`/api/itineraries/${id}`, data),
    get: (id) => api.get(`/api/itineraries/${id}`)
  },
  system: {
    health: () => api.get('/api/health'),
    status: () => api.get('/api/status')
  }
};

// Default export
export default api;