import axios from 'axios';

export const Api = axios.create({
  baseURL: process.env.VUE_APP_API_ENDPOINT || 'http://localhost:3000/api/v1'
});

// Request Interceptor to Add Authorization Header
Api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response Interceptor for Error Handling
Api.interceptors.response.use(
  (response) => response, // Pass successful responses through
  (error) => {
    // Handle common errors
    if (error.response?.status === 401) {
      alert('Session expired. Please log in again.');
      localStorage.removeItem('token');
      window.location.href = '/login'; // Redirect to login page
    }
    return Promise.reject(error); // Pass other errors to the caller
  }
);
