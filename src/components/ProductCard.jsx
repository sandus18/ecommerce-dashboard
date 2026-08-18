import { Link } from "react-router-dom";

function ProductCard({ product, onDelete }) {
  const outOfStock = product.stock === 0;

  return (
    <div className="col-sm-6 col-lg-4 col-xl-3">
      <div className="card h-100 border-0 shadow-sm product-card">
        <div className="position-relative">
          <img
            src={product.image}
            alt={product.name}
            className="card-img-top"
            style={{ height: 180, objectFit: "cover" }}
            onError={(e) => {
              e.target.src =
                "https://placehold.co/400x300?text=No+Image";
            }}
          />
          {outOfStock && (
            <span className="badge text-bg-danger position-absolute top-0 end-0 m-2">
              Out of Stock
            </span>
          )}
        </div>
        <div className="card-body d-flex flex-column">
          <span className="badge text-bg-light border mb-2 align-self-start">
            {product.category}
          </span>
          <h6 className="card-title mb-1">{product.name}</h6>
          <div className="text-warning small mb-2">
            <i className="bi bi-star-fill"></i> {product.rating}
          </div>
          <div className="fw-bold fs-5 mb-2">₹{product.price.toLocaleString()}</div>
          <div className="text-muted small mb-3">
            Stock: <strong>{product.stock}</strong>
          </div>
          <div className="mt-auto d-flex gap-2">
            <Link
              to={`/products/${product.id}`}
              className="btn btn-sm btn-outline-primary flex-fill"
            >
              <i className="bi bi-eye"></i> View
            </Link>
            <Link
              to={`/products/edit/${product.id}`}
              className="btn btn-sm btn-outline-secondary"
            >
              <i className="bi bi-pencil"></i>
            </Link>
            <button
              className="btn btn-sm btn-outline-danger"
              onClick={() => onDelete(product)}
            >
              <i className="bi bi-trash"></i>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductCard;
