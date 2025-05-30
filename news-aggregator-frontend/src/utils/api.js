import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use((config) => {
  const user = localStorage.getItem("user");
  const token = user ? JSON.parse(user).token : null;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

const handleRequest = async (request) => {
  try {
    const res = await request();
    return { success: true, data: res.data };
  } catch (err) {
    return {
      success: false,
      error: err?.response?.data?.message || err.message || "Unknown error",
    };
  }
};

export const getAllArticles = () =>
  handleRequest(() => api.get("/api/articles")).then((res) => res.data);

export const getArticlesByTopic = (topic) =>
  handleRequest(() => api.get("/api/articles", { params: { topic } })).then(
    (res) => res.data
  );

export const getArticleById = (id) =>
  handleRequest(() => api.get(`/api/articles/${id}`));

export const getUserArticles = () =>
  handleRequest(() => api.get("/api/users/recommended-articles")).then(
    (res) => res.data
  );

export const addBookmark = (article) =>
  handleRequest(() => api.patch("/api/users/add-bookmark", article));

export const removeBookmark = (article) =>
  handleRequest(() =>
    api.delete("/api/users/remove-bookmark", { data: article })
  );

export const updatePreferences = (preferences) =>
  handleRequest(() => api.put("/api/users/update-preferences", preferences));

export const loginUser = (credentials) =>
  handleRequest(() => api.post("/api/users/login", credentials));

export const registerUser = (userData) =>
  handleRequest(() => api.post("/api/users/register", userData));

export const getUserProfile = () =>
  handleRequest(() => api.get("/api/users/profile")).then((res) => res.data);
