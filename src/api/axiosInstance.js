import axios from "axios";

// Base URL for the JSON Server REST API.
// Run `npm run server` to start json-server on this port (see package.json).
const BASE_URL = import.meta.env.VITE_API_URL;

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000,
});

// Response interceptor for centralized error handling/logging
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error.response?.data?.message ||
      error.message ||
      "Something went wrong while contacting the server.";
    return Promise.reject(new Error(message));
  }
);

export default axiosInstance;
