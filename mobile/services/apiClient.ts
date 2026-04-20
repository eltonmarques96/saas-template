import api from "./api";

export const getPopularBooks = (limit = 10) =>
  api.get(`/books/popular?limit=${limit}`).then((r) => r.data);
export const searchBooks = (q: string) =>
  api.get(`/books/search?q=${encodeURIComponent(q)}`).then((r) => r.data);
export const getBookById = (id: string) =>
  api.get(`/books/${id}`).then((r) => r.data);
export const getBooksByCategory = (categoryId: string) =>
  api.get(`/books/category/${categoryId}`).then((r) => r.data);
export const getBooksByAuthor = (authorId: string) =>
  api.get(`/books/author/${authorId}`).then((r) => r.data);
export const getAuthorById = (id: string) =>
  api.get(`/authors/${id}`).then((r) => r.data);
export const getCategoryById = (id: string) =>
  api.get(`/categories/${id}`).then((r) => r.data);
export const getCategories = () => api.get("/categories").then((r) => r.data);
export const getReviewsByBook = (bookId: string) =>
  api.get(`/reviews/book/${bookId}`).then((r) => r.data);
export const createReview = (data: {
  bookId: string;
  stars: number;
  comment?: string;
}) => api.post("/reviews", data).then((r) => r.data);
export const updateReview = (
  id: string,
  data: { stars?: number; comment?: string },
) => api.patch(`/reviews/${id}`, data).then((r) => r.data);
export const deleteReview = (id: string) =>
  api.delete(`/reviews/${id}`).then((r) => r.data);
export const getCollections = () => api.get("/collections").then((r) => r.data);
export const createCollection = (name: string) =>
  api.post("/collections", { name }).then((r) => r.data);
export const getCollectionById = (id: string) =>
  api.get(`/collections/${id}`).then((r) => r.data);
export const addBookToCollection = (collectionId: string, bookId: string) =>
  api.post(`/collections/${collectionId}/books/${bookId}`).then((r) => r.data);
export const removeBookFromCollection = (
  collectionId: string,
  bookId: string,
) =>
  api
    .delete(`/collections/${collectionId}/books/${bookId}`)
    .then((r) => r.data);
export const deleteCollection = (id: string) =>
  api.delete(`/collections/${id}`).then((r) => r.data);
export const login = (email: string, password: string) =>
  api.post("/auth/login", { email, password }).then((r) => r.data);
export const register = (data: {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}) => api.post("/users", data).then((r) => r.data);
export const forgotPassword = (email: string) =>
  api.post("/users/forgotpassword", { email }).then((r) => r.data);
export const resetPassword = (token: string, password: string) =>
  api.post("/users/resetpassword", { token, password }).then((r) => r.data);
