import axios from "axios";
const API = "https://finca.onrender.com"
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
