import axios from "axios";
import "dotenv/config";
import { parseCookies } from "nookies";

const api = axios.create({
  baseURL:
    `${process.env.NEXT_PUBLIC_API_URL}/admin` || "http://localhost:8021",
  timeout: 10000,
});

api.interceptors.request.use((config) => {
  const { adminsimulaia: token } = parseCookies();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
