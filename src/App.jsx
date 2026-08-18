import { Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import Landing from "./pages/Landing";
import Dashboard from "./pages/Dashboard";
import Products from "./pages/Products";
import ProductDetails from "./pages/ProductDetails";
import AddProduct from "./pages/AddProduct";
import EditProduct from "./pages/EditProduct";
import Orders from "./pages/Orders";
import { ProductProvider } from "./context/ProductContext";

function NotFound() {
  return (
    <div className="container-fluid px-4 py-5 text-center">
      <h1 className="display-1 fw-bold text-primary">404</h1>
      <p className="text-muted">The page you're looking for doesn't exist.</p>
    </div>
  );
}

function App() {
  const location = useLocation();
  const isLanding = location.pathname === "/";

  return (
    <ProductProvider>
      {!isLanding && <Navbar />}
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/products" element={<Products />} />
        <Route path="/products/add" element={<AddProduct />} />
        <Route path="/products/edit/:id" element={<EditProduct />} />
        <Route path="/products/:id" element={<ProductDetails />} />
        <Route path="/orders" element={<Orders />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </ProductProvider>
  );
}

export default App;
