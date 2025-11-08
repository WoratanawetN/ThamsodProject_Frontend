// src/api/sessionApi.js
import apiClient from "./apiClient";

// 1. Join Session (Guest/Viewer) (Endpoint 3.5, Session #1)
export const joinSession = (sessionCode, authorName, role, guestId) => {
  return apiClient.post("/api/sessions/join", {
    sessionCode,
    authorName,
    role,
    guestId,
  });
};

// 2. Get Current Session (Guest/Viewer) (Endpoint 3.5, Session #2)
export const getCurrentSession = () => {
  // Token ของ Guest/Viewer จะบอกเองว่าอยู่ Session ไหน
  return apiClient.get("/api/sessions/current");
};

// 3. Host Create Session (Endpoint 3.5, Session #3)
export const createSession = (sessionName, description) => {
  return apiClient.post("/api/sessions", { sessionName, description });
};

// 4. Host Get All Sessions (Endpoint 3.5, Session #4)
export const getHostSessions = () => {
  return apiClient.get("/api/sessions");
};

// 5. Host Update Session (Endpoint 3.5, Session #5)
export const updateSession = (sessionId, data) => {
  // data = { sessionName, status, description }
  return apiClient.put(`/api/sessions/${sessionId}`, data);
};

// 6. Host Delete Session (Endpoint 3.5, Session #6)
export const deleteSession = (sessionId) => {
  return apiClient.delete(`/api/sessions/${sessionId}`);
};
