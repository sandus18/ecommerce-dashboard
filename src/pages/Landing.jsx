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
               
              </div>
            </div>

           
          </div>
        </div>
      </section>

     


      
    </div>
  );
}

export default Landing;
