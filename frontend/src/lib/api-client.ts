import axios, { AxiosError, AxiosInstance } from "axios";
import { env } from "@/config/env";

// Create axios instance
const apiClient: AxiosInstance = axios.create({
  baseURL: env.NEXT_PUBLIC_API_URL,
  withCredentials: true, // Send cookies
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000, // 10 second timeout
});

// Request interceptor - runs before every request
apiClient.interceptors.request.use(
  (config) => {
    console.log(`[API] ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// Response interceptor - runs after every response
apiClient.interceptors.response.use(
  (response) => {
    // Success response
    return response;
  },
  (error: AxiosError) => {
    // Handle errors globally
    if (error.response) {
      const status = error.response.status;

      // Log errors but DON'T redirect automatically
      switch (status) {
        case 401:
          console.warn("[API] Unauthorized request");
          // Let the component handle the 401 error
          break;
        case 403:
          console.error("[API] Forbidden - insufficient permissions");
          break;
        case 404:
          console.error("[API] Not found");
          break;
        case 500:
          console.error("[API] Server error");
          break;
        default:
          console.error(`[API] Error ${status}`);
      }
    } else if (error.request) {
      // Request made but no response
      console.error("[API] No response from server");
    } else {
      // Something else happened
      console.error("[API] Request error:", error.message);
    }

    return Promise.reject(error);
  },
);

export default apiClient;
