import axiosService from "../api/axiosService";

/* ---------------- Products ---------------- */
export const getProducts = () => axiosService.getAll("products");
export const getProductById = (id) => axiosService.getById("products", id);
export const createProduct = (data) => axiosService.create("products", data);
export const updateProduct = (id, data) =>
  axiosService.update("products", id, data);
export const deleteProduct = (id) => axiosService.remove("products", id);

/* ---------------- Orders ---------------- */
export const getOrders = () => axiosService.getAll("orders");
export const getOrderById = (id) => axiosService.getById("orders", id);
