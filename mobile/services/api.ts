import axios from "axios";
const api = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_URL || "http://192.168.15.12:8000",
});

export default api;
