// src/api.ts
import axios from "axios";
import * as SecureStore from "expo-secure-store";
import { API_URL } from "../config/constants";

const api = axios.create({ baseURL: API_URL });

api.interceptors.request.use(async (config) => {
  const token = await SecureStore.getItemAsync("token");
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
