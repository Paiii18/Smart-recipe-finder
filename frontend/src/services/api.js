import axios from 'axios';

// Get API URL from environment variable (Vercel will inject this)
const API_BASE_URL = 'https://uncut-futilely-wai.ngrok-free.dev';

console.log('🔗 API Base URL:', API_BASE_URL);

// Create axios instance
const api = axios.create({
  baseURL: `${API_BASE_URL}/api`,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000, // 30 seconds (ngrok bisa agak lambat)
  withCredentials: false, // Set false untuk CORS ngrok
});

// Request interceptor - Add JWT token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    console.log('Token being sent:', token ? 'Token exists' : 'No token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.error('❌ Request error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor - Handle errors
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Log error for debugging
    console.error('❌ API Error:', {
      url: error.config?.url,
      status: error.response?.status,
      message: error.message
    });

    // Handle 401 Unauthorized
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem('refresh_token');

        if (refreshToken) {
          const response = await axios.post(`${API_BASE_URL}/api/auth/refresh`, {
            refresh_token: refreshToken,
          });

          const { access_token } = response.data;
          localStorage.setItem('access_token', access_token);

          // Retry original request
          originalRequest.headers.Authorization = `Bearer ${access_token}`;
          return api(originalRequest);
        }
      } catch (refreshError) {
        // Refresh failed, logout
        console.error('❌ Token refresh failed');
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        
        // Only redirect if not already on login page
        if (window.location.pathname !== '/login') {
          window.location.href = '/login';
        }
        
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;