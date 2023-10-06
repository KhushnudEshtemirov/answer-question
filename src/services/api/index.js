import axios from "axios";

const baseUrl = "https://dc-api.muxlisa.uz/ict_week/api/v1/api/v1/question";

export const customAxios = axios.create({
  baseURL: baseUrl,
  headers: {
    "Content-Type": "application/json",
  },
});

export const API = {
  // Get requests
  getAllQuestions: (payload) =>
    customAxios.get(`/?page=${payload.page}&page_size=${payload.page_size}`),

  // Post requests
  postAnswer: (payload) => customAxios.post("/", payload),
  searchQuestion: (payload) => customAxios.get(`?search=${payload}`),

  // Updated requests
  updateAnswer: (payload) => customAxios.put(`/${payload.id}/`, payload),

  // Delete requests
  deleteAnswer: (payload) => customAxios.delete(`/${payload}/`),
};
