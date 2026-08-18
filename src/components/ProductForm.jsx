import { useState, useCallback } from "react";

const CATEGORIES = [
  "Electronics",
  "Footwear",
  "Fitness",
  "Accessories",
  "Clothing",
  "Home & Kitchen",
  "Other",
];

const EMPTY_PRODUCT = {
  name: "",
  category: "",
  price: "",
  stock: "",
  rating: "",
  image: "",
};

function validate(values) {
  const errors = {};

  if (!values.name || !values.name.trim()) {
    errors.name = "Product name is required.";
  }

  if (!values.category) {
    errors.category = "Please select a category.";
  }

  if (values.price === "" || values.price === null) {
    errors.price = "Price is required.";
  } else if (isNaN(values.price) || Number(values.price) <= 0) {
    errors.price = "Price must be a positive number.";
  }

  if (values.stock === "" || values.stock === null) {
    errors.stock = "Stock is required.";
  } else if (
    isNaN(values.stock) ||
    Number(values.stock) < 0 ||
    !Number.isInteger(Number(values.stock))
  ) {
    errors.stock = "Stock must be a whole number of 0 or more.";
  }

  if (values.rating === "" || values.rating === null) {
    errors.rating = "Rating is required.";
  } else if (isNaN(values.rating) || Number(values.rating) < 0 || Number(values.rating) > 5) {
    errors.rating = "Rating must be between 0 and 5.";
  }

  if (values.image && !/^https?:\/\/.+/i.test(values.image)) {
    errors.image = "Image must be a valid URL starting with http(s)://";
  }

  return errors;
}

function ProductForm({ initialValues, onSubmit, submitLabel = "Save Product" }) {
  const [values, setValues] = useState({ ...EMPTY_PRODUCT, ...initialValues });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setValues((prev) => ({ ...prev, [name]: value }));
  }, []);

  const handleReset = useCallback(() => {
    setValues({ ...EMPTY_PRODUCT, ...initialValues });
    setErrors({});
    setSubmitError(null);
  }, [initialValues]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate(values);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    setSubmitting(true);
    setSubmitError(null);
    try {
      await onSubmit({
        ...values,
        price: Number(values.price),
        stock: Number(values.stock),
        rating: Number(values.rating),
        image:
          values.image ||
          "https://placehold.co/400x300?text=" + encodeURIComponent(values.name || "Product"),
      });
    } catch (err) {
      setSubmitError(err.message || "Failed to save product.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} noValidate>
      {submitError && (
        <div className="alert alert-danger" role="alert">
          {submitError}
        </div>
      )}

      <div className="row g-3">
        <div className="col-md-6">
          <label className="form-label">Product Name *</label>
          <input
            type="text"
            name="name"
            className={`form-control ${errors.name ? "is-invalid" : ""}`}
            value={values.name}
            onChange={handleChange}
            placeholder="e.g. Wireless Headphones"
          />
          {errors.name && <div className="invalid-feedback">{errors.name}</div>}
        </div>

        <div className="col-md-6">
          <label className="form-label">Category *</label>
          <select
            name="category"
            className={`form-select ${errors.category ? "is-invalid" : ""}`}
            value={values.category}
            onChange={handleChange}
          >
            <option value="">Select category</option>
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
          {errors.category && <div className="invalid-feedback">{errors.category}</div>}
        </div>

        <div className="col-md-4">
          <label className="form-label">Price (₹) *</label>
          <input
            type="number"
            name="price"
            className={`form-control ${errors.price ? "is-invalid" : ""}`}
            value={values.price}
            onChange={handleChange}
            placeholder="0.00"
            min="0"
            step="0.01"
          />
          {errors.price && <div className="invalid-feedback">{errors.price}</div>}
        </div>

        <div className="col-md-4">
          <label className="form-label">Stock *</label>
          <input
            type="number"
            name="stock"
            className={`form-control ${errors.stock ? "is-invalid" : ""}`}
            value={values.stock}
            onChange={handleChange}
            placeholder="0"
            min="0"
            step="1"
          />
          {errors.stock && <div className="invalid-feedback">{errors.stock}</div>}
        </div>

        <div className="col-md-4">
          <label className="form-label">Rating (0–5) *</label>
          <input
            type="number"
            name="rating"
            className={`form-control ${errors.rating ? "is-invalid" : ""}`}
            value={values.rating}
            onChange={handleChange}
            placeholder="0.0"
            min="0"
            max="5"
            step="0.1"
          />
          {errors.rating && <div className="invalid-feedback">{errors.rating}</div>}
        </div>

        <div className="col-12">
          <label className="form-label">Image URL</label>
          <input
            type="text"
            name="image"
            className={`form-control ${errors.image ? "is-invalid" : ""}`}
            value={values.image}
            onChange={handleChange}
            placeholder="https://example.com/image.jpg"
          />
          {errors.image && <div className="invalid-feedback">{errors.image}</div>}
          <div className="form-text">Leave blank to use a placeholder image.</div>
        </div>
      </div>

      <div className="d-flex gap-2 mt-4">
        <button type="submit" className="btn btn-primary" disabled={submitting}>
          {submitting ? (
            <>
              <span className="spinner-border spinner-border-sm me-2"></span>
              Saving...
            </>
          ) : (
            submitLabel
          )}
        </button>
        <button type="button" className="btn btn-outline-secondary" onClick={handleReset}>
          Reset
        </button>
      </div>
    </form>
  );
}

export default ProductForm;
