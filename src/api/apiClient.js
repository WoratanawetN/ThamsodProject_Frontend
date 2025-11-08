// src/api/apiClient.js
import axios from "axios";

// 1. ดึง URL ของ Backend API จาก .env
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// 2. สร้าง instance ของ axios
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// 3. นี่คือหัวใจสำคัญ: Interceptor
// "ดักจับ" ทุก request ที่จะถูกยิงออกไป
apiClient.interceptors.request.use(
  (config) => {
    // 3.1 ดึง token จาก localStorage
    const token = localStorage.getItem("authToken");

    // 3.2 ถ้ามี token, ให้ยัดเข้าไปใน Header 'Authorization'
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    // ถ้ามี error ตอนดักจับ
    return Promise.reject(error);
  }
);

export default apiClient;
