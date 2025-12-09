import axios from "axios";
const API = "http://localhost:3000"
export const api = axios.create({
  baseURL: `${API}/api`,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

export const authAPI = {
  login: (data) => api.post("/auth/login", data),
  signup: (data) => api.post("/auth/signup", data),
};
