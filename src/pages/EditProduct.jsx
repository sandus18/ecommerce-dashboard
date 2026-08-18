import { useParams, useNavigate, Link } from "react-router-dom";
import { useProducts } from "../context/ProductContext";
import ProductForm from "../components/ProductForm";
import Loading from "../components/Loading";
import ErrorAlert from "../components/ErrorAlert";

function EditProduct() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { products, loading, error, editProduct } = useProducts();

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

  const handleSubmit = async (values) => {
    await editProduct(product.id, values);
    navigate(`/products/${product.id}`);
  };

  return (
    <div className="container-fluid px-4 py-4">
      <Link to={`/products/${product.id}`} className="btn btn-sm btn-outline-secondary mb-3">
        <i className="bi bi-arrow-left me-1"></i> Back to Product
      </Link>

      <div className="card border-0 shadow-sm">
        <div className="card-body">
          <h4 className="fw-bold mb-4">
            <i className="bi bi-pencil-square me-2"></i> Edit Product
          </h4>
          <ProductForm
            initialValues={product}
            onSubmit={handleSubmit}
            submitLabel="Update Product"
          />
        </div>
      </div>
    </div>
  );
}

export default EditProduct;
