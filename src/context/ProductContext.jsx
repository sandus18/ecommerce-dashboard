import { createContext, useCallback, useContext, useEffect, useState } from "react";
import {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../services/apiService";

const ProductContext = createContext(null);

export function ProductProvider({ children }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getProducts();
      setProducts(res.data);
    } catch (err) {
      setError(err.message || "Failed to load products.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const addProduct = useCallback(async (product) => {
    const res = await createProduct(product);
    setProducts((prev) => [...prev, res.data]);
    return res.data;
  }, []);

  const editProduct = useCallback(async (id, product) => {
    const res = await updateProduct(id, product);
    setProducts((prev) =>
      prev.map((p) => (String(p.id) === String(id) ? res.data : p))
    );
    return res.data;
  }, []);

  const removeProduct = useCallback(async (id) => {
    await deleteProduct(id);
    setProducts((prev) => prev.filter((p) => String(p.id) !== String(id)));
  }, []);

  const value = {
    products,
    loading,
    error,
    fetchProducts,
    addProduct,
    editProduct,
    removeProduct,
  };

  return (
    <ProductContext.Provider value={value}>{children}</ProductContext.Provider>
  );
}

export function useProducts() {
  const ctx = useContext(ProductContext);
  if (!ctx) {
    throw new Error("useProducts must be used within a ProductProvider");
  }
  return ctx;
}
