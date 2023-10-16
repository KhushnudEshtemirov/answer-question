import axios from "axios";

const baseUrl = "https://dc-api.muxlisa.uz/ict_week/api/v1/api/v1";

export const customAxios = axios.create({
  baseURL: baseUrl,
  headers: {
    "Content-Type": "application/json",
  },
});

export const API = {
  // Get requests
  getAllQuestions: (payload) =>
    customAxios.get(
      `/question/?page=${payload.page}&page_size=${payload.page_size}`
    ),
  getAllCategories: () => customAxios.get("/category/"),
  searchQuestion: (payload) => customAxios.get(`/question?search=${payload}`),

  // Post requests
  postAnswer: (payload) => customAxios.post("/question/", payload),
  addCategory: (payload) => customAxios.post("/category/", payload),

  // Updated requests
  updateAnswer: (payload) =>
    customAxios.put(`/question/${payload.id}/`, payload),
  updateCategory: (payload) =>
    customAxios.put(`/category/${payload.id}/`, payload),

  // Delete requests
  deleteAnswer: (payload) => customAxios.delete(`/question/${payload}/`),
  deleteCategory: (payload) => customAxios.delete(`/category/${payload}/`),
};
