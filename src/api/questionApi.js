// src/api/questionApi.js
import apiClient from "./apiClient";

// 1. Guest Submit Question (Endpoint 3.5, Question #1)
export const submitQuestion = (content) => {
  // Token ของ Guest จะบอกเองว่าอยู่ Session ไหน
  return apiClient.post("/api/questions", { content });
};

// 2. Get All Questions for Session (Endpoint 3.5, Question #2)
export const getSessionQuestions = (sessionId) => {
  return apiClient.get(`/api/questions/session/${sessionId}`);
};

// 3. Guest Upvote Question (Endpoint 3.5, Question #3)
export const upvoteQuestion = (questionId) => {
  return apiClient.put(`/api/questions/${questionId}/upvote`);
};

// 4. Host Update Question Status (Endpoint 3.5, Question #4)
export const updateQuestionStatus = (questionId, status) => {
  // status = 'approved' or 'rejected'
  return apiClient.put(`/api/questions/${questionId}/status`, { status });
};

// 5. Host Highlight Question (Endpoint 3.5, Question #5)
export const highlightQuestion = (questionId) => {
  return apiClient.put(`/api/questions/${questionId}/highlight`);
};
