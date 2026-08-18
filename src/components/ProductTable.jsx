import { Link } from "react-router-dom";

function ProductTable({ products, onDelete }) {
  if (products.length === 0) {
    return (
      <div className="text-center text-muted py-5">
        <i className="bi bi-inbox fs-1 d-block mb-2"></i>
        No products found.
      </div>
    );
  }

  return (
    <div className="table-responsive">
      <table className="table table-hover align-middle">
        <thead className="table-light">
          <tr>
            <th>Image</th>
            <th>Name</th>
            <th>Category</th>
            <th>Price</th>
            <th>Stock</th>
            <th>Rating</th>
            <th className="text-end">Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product.id}>
              <td>
                <img
                  src={product.image}
                  alt={product.name}
                  width={48}
                  height={48}
                  style={{ objectFit: "cover", borderRadius: 8 }}
                  onError={(e) => {
                    e.target.src = "https://placehold.co/48x48?text=NA";
                  }}
                />
              </td>
              <td className="fw-semibold">{product.name}</td>
              <td>
                <span className="badge text-bg-light border">{product.category}</span>
              </td>
              <td>₹{product.price.toLocaleString()}</td>
              <td>
                {product.stock === 0 ? (
                  <span className="badge text-bg-danger">Out of stock</span>
                ) : (
                  product.stock
                )}
              </td>
              <td>
                <i className="bi bi-star-fill text-warning"></i> {product.rating}
              </td>
              <td className="text-end">
                <div className="btn-group btn-group-sm">
                  <Link to={`/products/${product.id}`} className="btn btn-outline-primary">
                    <i className="bi bi-eye"></i>
                  </Link>
                  <Link to={`/products/edit/${product.id}`} className="btn btn-outline-secondary">
                    <i className="bi bi-pencil"></i>
                  </Link>
                  <button className="btn btn-outline-danger" onClick={() => onDelete(product)}>
                    <i className="bi bi-trash"></i>
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ProductTable;
