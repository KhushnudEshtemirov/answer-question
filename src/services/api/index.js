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
  getAllQuestions: () => customAxios.get("/"),
  getOneQuestion: (payload) => customAxios.get(`/${payload.queryKey[1]}/`),
  // Post requests
  postAnswer: (payload) => customAxios.post("/", payload),

  // Updated requests
  updateAnswer: (payload) => customAxios.put(`/${payload}`),

  // Delete requests
  deleteAnswer: (payload) => customAxios.delete(`/${payload}/`),
};
