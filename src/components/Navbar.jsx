import { NavLink } from "react-router-dom";

function Navbar() {
  const linkClass = ({ isActive }) =>
    `nav-link px-3 ${isActive ? "active fw-semibold text-primary" : "text-dark"}`;

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-white border-bottom shadow-sm sticky-top">
      <div className="container-fluid px-4">
        <NavLink to="/dashboard" className="navbar-brand fw-bold text-primary d-flex align-items-center gap-2">
          <i className="bi bi-shop fs-4"></i>
          ShopAdmin
        </NavLink>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#mainNavbar"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="mainNavbar">
          <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <NavLink to="/dashboard" end className={linkClass}>
                <i className="bi bi-speedometer2 me-1"></i> Dashboard
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink to="/products" className={linkClass}>
                <i className="bi bi-box-seam me-1"></i> Products
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink to="/orders" className={linkClass}>
                <i className="bi bi-receipt me-1"></i> Orders
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink to="/products/add" className={linkClass}>
                <i className="bi bi-plus-circle me-1"></i> Add Product
              </NavLink>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
