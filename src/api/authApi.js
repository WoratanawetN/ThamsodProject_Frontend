// src/api/authApi.js
import apiClient from "./apiClient";

// 1. Host Login (Endpoint 3.5, Auth #1)
export const login = (username, password) => {
  return apiClient.post("/api/auth/login", { username, password });
};

// 2. Host Register (Endpoint 3.5, Auth #2)
export const register = (username, password) => {
  return apiClient.post("/api/auth/register", { username, password });
};

// 3. Get Host Data (Endpoint 3.5, Auth #3)
export const getMe = () => {
  return apiClient.get("/api/auth/me");
};
