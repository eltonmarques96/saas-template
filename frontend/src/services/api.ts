import axios, { AxiosHeaders, InternalAxiosRequestConfig } from "axios";
import "dotenv/config";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8021",
});
api.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    const method = config.method?.toLowerCase();
    const METHODS_REQUIRING_CSRF = ["post", "put", "patch", "delete"];

    if (method && METHODS_REQUIRING_CSRF.includes(method)) {
      try {
        const { data: csrfData } = await api.get("/auth/csrf-token");
        const csrfToken = csrfData.csrfToken;
        if (!config.headers) {
          config.headers = new AxiosHeaders();
        }
        config.headers.set("X-CSRF-Token", csrfToken);
      } catch (err) {
        console.warn("Erro ao buscar token CSRF", err);
        throw err;
      }
    }

    return config;
  },
  (error) => Promise.reject(error)
);
export default api;
