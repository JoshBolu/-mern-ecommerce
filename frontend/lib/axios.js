import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: "http://localhost:3000/api/v1", // Base URL for the API
    withCredentials: true, // Include credentials (cookies) in requests
})

export default axiosInstance;