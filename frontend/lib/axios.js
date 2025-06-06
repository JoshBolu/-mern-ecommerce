// Create an Axios instance with dynamic baseURL:
import axios from "axios";

const axiosInstance = axios.create({
  // - In development, point to local backend server.
  // - In production, use relative path to the deployed backend.
  baseURL:
    import.meta.mode === "development"
      ? "http://localhost:3000/api/v1"
      : "/api/v1", // Base URL for the API
  withCredentials: true,  // Also ensure cookies (credentials) are included in all requests.
});

export default axiosInstance;