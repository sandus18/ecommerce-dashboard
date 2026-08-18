import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useProducts } from "../context/ProductContext";
import Loading from "../components/Loading";
import ErrorAlert from "../components/ErrorAlert";
import ConfirmModal from "../components/ConfirmModal";

function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { products, loading, error, removeProduct } = useProducts();
  const [showConfirm, setShowConfirm] = useState(false);
  const [deleteError, setDeleteError] = useState(null);

  if (loading) return <Loading label="Loading product..." />;
  if (error) return <div className="container-fluid px-4 py-4"><ErrorAlert message={error} /></div>;

  const product = products.find((p) => String(p.id) === String(id));

  if (!product) {
    return (
      <div className="container-fluid px-4 py-4">
        <ErrorAlert message="Product not found." />
        <Link to="/products" className="btn btn-outline-primary mt-2">
          <i className="bi bi-arrow-left me-1"></i> Back to Products
        </Link>
      </div>
    );
  }

  const handleDelete = async () => {
    try {
      await removeProduct(product.id);
      navigate("/products");
    } catch (err) {
      setDeleteError(err.message || "Failed to delete product.");
      setShowConfirm(false);
    }
  };

  return (
    <div className="container-fluid px-4 py-4">
      <Link to="/products" className="btn btn-sm btn-outline-secondary mb-3">
        <i className="bi bi-arrow-left me-1"></i> Back to Products
      </Link>

      {deleteError && <ErrorAlert message={deleteError} />}

      <div className="card border-0 shadow-sm">
        <div className="row g-0">
          <div className="col-md-5">
            <img
              src={product.image}
              alt={product.name}
              className="img-fluid rounded-start w-100 h-100"
              style={{ objectFit: "cover", maxHeight: 420 }}
              onError={(e) => {
                e.target.src = "https://placehold.co/500x400?text=No+Image";
              }}
            />
          </div>
          <div className="col-md-7">
            <div className="card-body">
              <span className="badge text-bg-light border mb-2">{product.category}</span>
              <h3 className="fw-bold">{product.name}</h3>
              <div className="text-warning mb-3">
                <i className="bi bi-star-fill"></i> {product.rating} / 5
              </div>
              <h2 className="text-primary fw-bold mb-3">₹{product.price.toLocaleString()}</h2>

              <div className="mb-3">
                {product.stock === 0 ? (
                  <span className="badge text-bg-danger fs-6">Out of Stock</span>
                ) : (
                  <span className="badge text-bg-success fs-6">{product.stock} in stock</span>
                )}
              </div>

              {product.sales !== undefined && (
                <p className="text-muted mb-4">
                  <i className="bi bi-graph-up me-1"></i>
                  {product.sales} units sold
                </p>
              )}

              <div className="d-flex gap-2">
                <Link to={`/products/edit/${product.id}`} className="btn btn-primary">
                  <i className="bi bi-pencil me-1"></i> Edit
                </Link>
                <button className="btn btn-outline-danger" onClick={() => setShowConfirm(true)}>
                  <i className="bi bi-trash me-1"></i> Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <ConfirmModal
        show={showConfirm}
        title="Delete Product"
        message={`Are you sure you want to delete "${product.name}"? This action cannot be undone.`}
        onConfirm={handleDelete}
        onCancel={() => setShowConfirm(false)}
      />
    </div>
  );
}

export default ProductDetails;
