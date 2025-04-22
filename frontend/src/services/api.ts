import axios from "axios";
import "dotenv/config";

const api = axios.create({
  baseURL: process.env.API_URL || "http://localhost:8001",
});

export default api;
