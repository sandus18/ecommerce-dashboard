import { useState, useMemo, useCallback } from "react";
import { Link } from "react-router-dom";
import { useProducts } from "../context/ProductContext";
import SearchBar from "../components/SearchBar";
import ProductTable from "../components/ProductTable";
import ProductCard from "../components/ProductCard";
import Pagination from "../components/Pagination";
import Loading from "../components/Loading";
import ErrorAlert from "../components/ErrorAlert";
import ConfirmModal from "../components/ConfirmModal";

const PAGE_SIZE = 8;

function Products() {
  const { products, loading, error, fetchProducts, removeProduct } = useProducts();

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [stockFilter, setStockFilter] = useState("All");
  const [sortOrder, setSortOrder] = useState("none");
  const [view, setView] = useState("table");
  const [page, setPage] = useState(1);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleteError, setDeleteError] = useState(null);

  const categories = useMemo(() => {
    const unique = new Set(products.map((p) => p.category));
    return ["All", ...unique];
  }, [products]);

  const filteredProducts = useMemo(() => {
    let result = products.filter((p) =>
      p.name.toLowerCase().includes(search.toLowerCase())
    );

    if (category !== "All") {
      result = result.filter((p) => p.category === category);
    }

    if (stockFilter === "In Stock") {
      result = result.filter((p) => p.stock > 0);
    } else if (stockFilter === "Out of Stock") {
      result = result.filter((p) => p.stock === 0);
    }

    if (sortOrder === "asc") {
      result = [...result].sort((a, b) => a.price - b.price);
    } else if (sortOrder === "desc") {
      result = [...result].sort((a, b) => b.price - a.price);
    }

    return result;
  }, [products, search, category, stockFilter, sortOrder]);

  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / PAGE_SIZE));
  const paginatedProducts = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return filteredProducts.slice(start, start + PAGE_SIZE);
  }, [filteredProducts, page]);

  const handleFilterChange = useCallback((setter) => (value) => {
    setter(value);
    setPage(1);
  }, []);

  const handleDeleteRequest = useCallback((product) => {
    setDeleteTarget(product);
    setDeleteError(null);
  }, []);

  const handleDeleteConfirm = useCallback(async () => {
    try {
      await removeProduct(deleteTarget.id);
      setDeleteTarget(null);
    } catch (err) {
      setDeleteError(err.message || "Failed to delete product.");
    }
  }, [deleteTarget, removeProduct]);

  if (loading) return <Loading label="Loading products..." />;
  if (error) return <div className="container-fluid px-4 py-4"><ErrorAlert message={error} onRetry={fetchProducts} /></div>;

  return (
    <div className="container-fluid px-4 py-4">
      <div className="d-flex flex-wrap justify-content-between align-items-center mb-4 gap-2">
        <h3 className="fw-bold mb-0">Products</h3>
        <Link to="/products/add" className="btn btn-primary">
          <i className="bi bi-plus-circle me-1"></i> Add Product
        </Link>
      </div>

      {deleteError && <ErrorAlert message={deleteError} />}

      <div className="card border-0 shadow-sm mb-4">
        <div className="card-body">
          <div className="row g-3 align-items-end">
            <div className="col-md-4">
              <label className="form-label small text-muted mb-1">Search</label>
              <SearchBar
                value={search}
                onChange={handleFilterChange(setSearch)}
                placeholder="Search by product name..."
              />
            </div>
            <div className="col-md-3 col-6">
              <label className="form-label small text-muted mb-1">Category</label>
              <select
                className="form-select"
                value={category}
                onChange={(e) => handleFilterChange(setCategory)(e.target.value)}
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
            <div className="col-md-2 col-6">
              <label className="form-label small text-muted mb-1">Availability</label>
              <select
                className="form-select"
                value={stockFilter}
                onChange={(e) => handleFilterChange(setStockFilter)(e.target.value)}
              >
                <option value="All">All</option>
                <option value="In Stock">In Stock</option>
                <option value="Out of Stock">Out of Stock</option>
              </select>
            </div>
            <div className="col-md-2 col-6">
              <label className="form-label small text-muted mb-1">Sort by Price</label>
              <select
                className="form-select"
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value)}
              >
                <option value="none">None</option>
                <option value="asc">Low to High</option>
                <option value="desc">High to Low</option>
              </select>
            </div>
            <div className="col-md-1 col-6 d-flex gap-1">
              <button
                className={`btn btn-sm ${view === "table" ? "btn-primary" : "btn-outline-secondary"}`}
                onClick={() => setView("table")}
                title="Table view"
              >
                <i className="bi bi-list-ul"></i>
              </button>
              <button
                className={`btn btn-sm ${view === "card" ? "btn-primary" : "btn-outline-secondary"}`}
                onClick={() => setView("card")}
                title="Card view"
              >
                <i className="bi bi-grid-3x3-gap"></i>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="text-muted small mb-2">
        Showing {paginatedProducts.length} of {filteredProducts.length} products
      </div>

      {view === "table" ? (
        <div className="card border-0 shadow-sm">
          <div className="card-body">
            <ProductTable products={paginatedProducts} onDelete={handleDeleteRequest} />
          </div>
        </div>
      ) : (
        <div className="row g-3">
          {paginatedProducts.length === 0 ? (
            <div className="text-center text-muted py-5">
              <i className="bi bi-inbox fs-1 d-block mb-2"></i>
              No products found.
            </div>
          ) : (
            paginatedProducts.map((product) => (
              <ProductCard key={product.id} product={product} onDelete={handleDeleteRequest} />
            ))
          )}
        </div>
      )}

      <div className="mt-4">
        <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
      </div>

      <ConfirmModal
        show={!!deleteTarget}
        title="Delete Product"
        message={`Are you sure you want to delete "${deleteTarget?.name}"? This action cannot be undone.`}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}

export default Products;
