import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    console.log(`Making ${config.method?.toUpperCase()} request to ${config.url}`);
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

// API functions
export const chatAPI = {
  sendMessage: (message, conversation = []) =>
    api.post('/api/chat', { message, conversation }),
};

export const attractionsAPI = {
  getAttractions: (location, limit = 10) =>
    api.get(`/api/attractions/${encodeURIComponent(location)}`, {
      params: { limit },
    }),
};

export const imagesAPI = {
  getImages: (query, perPage = 9) =>
    api.get(`/api/images/${encodeURIComponent(query)}`, {
      params: { per_page: perPage },
    }),
};

export const weatherAPI = {
  getWeather: (location, days = 7) =>
    api.get(`/api/weather/${encodeURIComponent(location)}`, {
      params: { days },
    }),
};

export const flightsAPI = {
  searchFlights: (params) =>
    api.get('/api/flights', { params }),
};

export const hotelsAPI = {
  searchHotels: (params) =>
    api.get('/api/hotels', { params }),
};

export const itineraryAPI = {
  generateItinerary: (data) =>
    api.post('/api/generate-itinerary', data),
};

export const healthAPI = {
  checkHealth: () =>
    api.get('/api/health'),
};

export default api;

