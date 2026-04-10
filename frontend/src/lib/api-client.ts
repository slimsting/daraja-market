// src/lib/api-client.ts
import axios, { AxiosError, AxiosInstance } from "axios";
import { env } from "@/config/env";
import { apiLogger } from "./loggers";

// Custom API error class for better error handling downstream
export class ApiError extends Error {
  constructor(
    public status: number,
    public message: string,
    public data?: unknown,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

const apiClient: AxiosInstance = axios.create({
  baseURL: env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000,
});

// Request interceptor
apiClient.interceptors.request.use(
  (config) => {
    // Axios will automatically set the correct multipart boundary if Content-Type is not forced.
    if (config.data instanceof FormData) {
      if (config.headers) {
        const headers = config.headers as Record<string, string>;
        delete headers["Content-Type"];
      }
    }

    apiLogger.debug(
      {
        method: config.method?.toUpperCase(),
        url: config.url,
        data: config.data,
      },
      "Outgoing request",
    );
    return config;
  },
  (error) => {
    apiLogger.error({ error }, "Request setup failed");
    return Promise.reject(error);
  },
);

// Response interceptor
apiClient.interceptors.response.use(
  (response) => {
    apiLogger.debug(
      {
        method: response.config.method?.toUpperCase(),
        url: response.config.url,
        status: response.status,
      },
      "Response received",
    );
    return response;
  },
  (error: AxiosError) => {
    const method = error.config?.method?.toUpperCase();
    const url = error.config?.url;
    const status = error.response?.status;
    const data = error.response?.data;

    // No response from server
    if (!error.response) {
      if (error.request) {
        apiLogger.error(
          { method, url },
          "No response - check if backend is running",
        );
      } else {
        apiLogger.error(
          { method, url, message: error.message },
          "Request setup error",
        );
      }
      return Promise.reject(
        new ApiError(0, "Network error - no response from server"),
      );
    }

    // Handle HTTP status codes
    switch (status) {
      case 400:
        apiLogger.warn(
          { method, url, data },
          "Bad request - invalid data sent",
        );
        return Promise.reject(
          new ApiError(400, "Bad request - please check your input"),
        );

      case 401:
        apiLogger.warn({ method, url }, "Unauthorized - user needs to login");
        return Promise.reject(
          new ApiError(401, "Unauthorized - invalid credentials"),
        );

      case 403:
        apiLogger.warn({ method, url }, "Forbidden - insufficient permissions");
        return Promise.reject(
          new ApiError(403, "Forbidden - you do not have permission"),
        );

      case 404:
        apiLogger.warn({ method, url }, "Resource not found");
        return Promise.reject(new ApiError(404, "Resource not found"));

      case 409:
        apiLogger.warn(
          { method, url, data },
          "Conflict - resource already exists",
        );
        return Promise.reject(
          new ApiError(409, "Conflict - resource already exists"),
        );

      case 422:
        apiLogger.warn({ method, url, data }, "Validation error from server");
        return Promise.reject(
          new ApiError(422, "Validation failed - please check your input"),
        );

      case 429:
        apiLogger.warn({ method, url }, "Rate limited - too many requests");
        return Promise.reject(
          new ApiError(429, "Too many requests - please slow down"),
        );

      case 500:
        apiLogger.error({ method, url, data }, "Internal server error");
        return Promise.reject(
          new ApiError(500, "Server error - please try again later"),
        );

      case 502:
        apiLogger.error({ method, url }, "Bad gateway");
        return Promise.reject(
          new ApiError(502, "Bad gateway - server is unreachable"),
        );

      case 503:
        apiLogger.error({ method, url }, "Service unavailable");
        return Promise.reject(
          new ApiError(503, "Service unavailable - please try again later"),
        );

      default:
        apiLogger.error({ method, url, status, data }, "Unexpected error");
        return Promise.reject(
          new ApiError(status ?? 0, `Unexpected error: ${status}`),
        );
    }
  },
);

export default apiClient;
