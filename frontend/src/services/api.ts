import axios from "axios";
import "dotenv/config";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8021",
});

export default api;
