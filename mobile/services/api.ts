import axios, { AxiosHeaders, InternalAxiosRequestConfig } from "axios";
const api = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_URL || "http://192.168.15.12:8001",
});

api.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    const method = config.method?.toLowerCase();
    const METHODS_REQUIRING_CSRF = ["post", "put", "patch", "delete"];

    // Se o método exige CSRF
    if (method && METHODS_REQUIRING_CSRF.includes(method)) {
      try {
        // Requisição para obter o token
        const { data: csrfData } = await api.get("/auth/csrf-token");
        const csrfToken = csrfData?.csrfToken;

        if (!config.headers) {
          config.headers = new AxiosHeaders(); // ou {}
        }

        // Define o cabeçalho CSRF
        if (csrfToken) {
          config.headers.set("X-CSRF-Token", csrfToken);
        }
      } catch (err) {
        console.warn("Erro ao buscar token CSRF:", err);
        throw err;
      }
    }

    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
