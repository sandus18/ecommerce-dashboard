import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useProducts } from "../context/ProductContext";
import { getOrders } from "../services/apiService";
import "./Landing.css";

const MANIFEST = [
  {
    code: "SKU-01",
    icon: "bi-box-seam",
    title: "Products",
    description:
      "Search, filter by category or stock, sort by price, and page through your full catalog. Add, edit, or retire a listing in a couple of clicks.",
    to: "/products",
  },
  {
    code: "ORD-02",
    icon: "bi-receipt",
    title: "Orders",
    description:
      "See every order as it comes in, filter by status, sort by date, and open any order to check what was bought and for how much.",
    to: "/orders",
  },
  {
    code: "RPT-03",
    icon: "bi-speedometer2",
    title: "Dashboard",
    description:
      "Revenue, order count, and low-stock warnings in one screen, with your five best sellers charted out so you know what to restock first.",
    to: "/dashboard",
  },
];

function Landing() {
  const { products } = useProducts();
  const [orderCount, setOrderCount] = useState(null);

  useEffect(() => {
    let cancelled = false;
    getOrders()
      .then((res) => {
        if (!cancelled) setOrderCount(res.data.length);
      })
      .catch(() => {
        if (!cancelled) setOrderCount(null);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const outOfStock = useMemo(
    () => products.filter((p) => p.stock === 0).length,
    [products]
  );

  return (
    <div className="landing">
      {/* Top bar */}
      <header className="landing-topbar">
        <div className="container-xl d-flex align-items-center justify-content-between py-3">
          <span className="d-flex align-items-center gap-2 font-display fw-bold fs-5">
            <span className="brand-mark">
              <i className="bi bi-shop"></i>
            </span>
            ShopAdmin
          </span>
          <Link to="/dashboard" className="btn-outline-ink btn btn-sm">
            Open Dashboard
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="landing-hero">
        <div className="container-xl">
          <div className="row align-items-center g-5">
            <div className="col-lg-6">
              <span className="eyebrow">Inventory &amp; order tracking</span>
              <h1 className="mt-3 mb-3">
                Know what's in stock
                <br />
                before your customers ask.
              </h1>
              <p className="lede mb-4">
                ShopAdmin is a lightweight back office for a small store: one
                place to manage products, watch orders come in, and see what's
                actually selling — no spreadsheet required.
              </p>
              <div className="d-flex flex-wrap gap-3">
                <Link to="/dashboard" className="btn-ink btn">
                  Open Dashboard <i className="bi bi-arrow-right ms-1"></i>
                </Link>
                <Link to="/products" className="btn-outline-ink btn">
                  Browse Products
                </Link>
              </div>
            </div>

            <div className="col-lg-6">
              <div className="tag-wrap">
                <div className="tag-inner">
                  <div className="tag-string"></div>
                  <div className="shipping-tag font-mono">
                    <div className="stamp">IN STOCK</div>
                    <div className="tag-row">
                      <span>SKU-0001</span>
                      <span>QTY 15</span>
                    </div>
                    <div className="tag-title">Wireless Headphones</div>
                    <div className="barcode"></div>
                    <div className="tag-price">₹2,499</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Live stats strip */}
      <section className="stats-strip">
        <div className="container-xl py-4">
          <div className="row g-4 text-center text-md-start">
            <div className="col-6 col-md-3">
              <div className="stat-value">{products.length}</div>
              <div className="stat-label">Products tracked</div>
            </div>
            <div className="col-6 col-md-3">
              <div className="stat-value">
                {orderCount === null ? "—" : orderCount}
              </div>
              <div className="stat-label">Orders logged</div>
            </div>
            <div className="col-6 col-md-3">
              <div className="stat-value">{outOfStock}</div>
              <div className="stat-label">Out of stock</div>
            </div>
            <div className="col-6 col-md-3">
              <div className="stat-value">
                {new Set(products.map((p) => p.category)).size}
              </div>
              <div className="stat-label">Categories</div>
            </div>
          </div>
        </div>
      </section>

      {/* Manifest / features */}
      <section className="manifest-section">
        <div className="container-xl">
          <h2 className="manifest-heading mb-4">What's on the manifest</h2>
          {MANIFEST.map((item) => (
            <Link key={item.code} to={item.to} className="text-decoration-none text-reset">
              <div className="manifest-row">
                <span className="manifest-code">{item.code}</span>
                <span className="manifest-icon">
                  <i className={`bi ${item.icon}`}></i>
                </span>
                <div>
                  <h3>{item.title}</h3>
                  <p>{item.description}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* CTA band */}
      <section className="container-xl">
        <div className="cta-band d-flex flex-wrap align-items-center justify-content-between gap-3">
          <div>
            <h2 className="mb-2">Ready to see today's numbers?</h2>
            <p className="mb-0" style={{ color: "#c7ccd8" }}>
              Jump straight into the dashboard — it's already up to date.
            </p>
          </div>
          <Link to="/dashboard" className="btn btn-paper">
            Open Dashboard <i className="bi bi-arrow-right ms-1"></i>
          </Link>
        </div>
      </section>
    </div>
  );
}

export default Landing;
