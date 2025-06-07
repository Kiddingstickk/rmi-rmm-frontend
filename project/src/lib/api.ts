// src/lib/api.ts (or utils/api.ts)
import axios from "axios";

const api = axios.create({
  baseURL: "https://backend-p0ja.onrender.com/api",
  headers: {
    Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
  },
});

export default api;
