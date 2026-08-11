import axios from "axios";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 30000,
});

// Request Interceptor: Attach Bearer JWT
apiClient.interceptors.request.use(
  (config) => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token");
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Handle 401/403 Session Expiry
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && typeof window !== "undefined") {
      const status = error.response.status;
      if (status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        if (!window.location.pathname.startsWith("/login") && !window.location.pathname.startsWith("/session-expired")) {
          window.location.href = "/session-expired";
        }
      }
    }
    return Promise.reject(error);
  }
);
