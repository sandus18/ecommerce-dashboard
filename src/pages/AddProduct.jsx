import { useNavigate, Link } from "react-router-dom";
import { useProducts } from "../context/ProductContext";
import ProductForm from "../components/ProductForm";

function AddProduct() {
  const navigate = useNavigate();
  const { addProduct } = useProducts();

  const handleSubmit = async (values) => {
    const created = await addProduct(values);
    navigate(`/products/${created.id}`);
  };

  return (
    <div className="container-fluid px-4 py-4">
      <Link to="/products" className="btn btn-sm btn-outline-secondary mb-3">
        <i className="bi bi-arrow-left me-1"></i> Back to Products
      </Link>

      <div className="card border-0 shadow-sm">
        <div className="card-body">
          <h4 className="fw-bold mb-4">
            <i className="bi bi-plus-circle me-2"></i> Add New Product
          </h4>
          <ProductForm onSubmit={handleSubmit} submitLabel="Add Product" />
        </div>
      </div>
    </div>
  );
}

export default AddProduct;
