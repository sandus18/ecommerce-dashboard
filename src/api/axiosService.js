import axiosInstance from "./axiosInstance";

// Generic REST helpers reused by apiService.js for both /products and /orders
const axiosService = {
  getAll: (resource) => axiosInstance.get(`/${resource}`),
  getById: (resource, id) => axiosInstance.get(`/${resource}/${id}`),
  create: (resource, data) => axiosInstance.post(`/${resource}`, data),
  update: (resource, id, data) => axiosInstance.put(`/${resource}/${id}`, data),
  remove: (resource, id) => axiosInstance.delete(`/${resource}/${id}`),
};

export default axiosService;
