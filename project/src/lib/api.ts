
import axios from "axios";
import { clearAuthSession, getValidToken } from "../rmi/lib/authSession";

const api = axios.create({
  baseURL: "https://backend-p0ja.onrender.com/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// Attach the current, unexpired token to API requests.
api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = getValidToken();
    

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }

  return config;
});

// A 401 means authentication is missing, invalid, or expired.
// A 403 is a permission error and must not automatically log out.
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error?.response?.status === 401) {
      clearAuthSession();
    }

    return Promise.reject(error);
  }
);

export default api;
