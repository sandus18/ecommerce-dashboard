import { useEffect, useState, useMemo, useCallback } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { useProducts } from "../context/ProductContext";
import { getOrders } from "../services/apiService";
import StatCard from "../components/StatCard";
import Loading from "../components/Loading";
import ErrorAlert from "../components/ErrorAlert";

function Dashboard() {
  const { products, loading: productsLoading, error: productsError, fetchProducts } =
    useProducts();

  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const [ordersError, setOrdersError] = useState(null);

  const fetchOrders = useCallback(async () => {
    setOrdersLoading(true);
    setOrdersError(null);
    try {
      const res = await getOrders();
      setOrders(res.data);
    } catch (err) {
      setOrdersError(err.message || "Failed to load orders.");
    } finally {
      setOrdersLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const totalRevenue = useMemo(
    () => orders.reduce((sum, order) => sum + (order.total || 0), 0),
    [orders]
  );

  const outOfStockCount = useMemo(
    () => products.filter((p) => p.stock === 0).length,
    [products]
  );

  const topProducts = useMemo(() => {
    return [...products]
      .sort((a, b) => (b.sales || 0) - (a.sales || 0))
      .slice(0, 5)
      .map((p) => ({ name: p.name, sales: p.sales || 0 }));
  }, [products]);

  const loading = productsLoading || ordersLoading;
  const error = productsError || ordersError;

  if (loading) return <Loading label="Loading dashboard..." />;

  return (
    <div className="container-fluid px-4 py-4">
      <h3 className="mb-4 fw-bold">Dashboard</h3>

      {error && (
        <ErrorAlert
          message={error}
          onRetry={() => {
            fetchProducts();
            fetchOrders();
          }}
        />
      )}

      <div className="row g-3 mb-4">
        <div className="col-sm-6 col-xl-3">
          <StatCard
            title="Total Products"
            value={products.length}
            icon="bi-box-seam"
            color="primary"
          />
        </div>
        <div className="col-sm-6 col-xl-3">
          <StatCard
            title="Total Orders"
            value={orders.length}
            icon="bi-receipt"
            color="success"
          />
        </div>
        <div className="col-sm-6 col-xl-3">
          <StatCard
            title="Total Revenue"
            value={`₹${totalRevenue.toLocaleString()}`}
            icon="bi-currency-rupee"
            color="warning"
          />
        </div>
        <div className="col-sm-6 col-xl-3">
          <StatCard
            title="Out of Stock"
            value={outOfStockCount}
            icon="bi-exclamation-triangle"
            color="danger"
          />
        </div>
      </div>

      <div className="row g-3">
        <div className="col-lg-8">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body">
              <h6 className="card-title fw-semibold mb-3">
                <i className="bi bi-bar-chart-line me-2"></i>
                Top 5 Products by Sales
              </h6>
              {topProducts.length === 0 ? (
                <p className="text-muted mb-0">No sales data available.</p>
              ) : (
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={topProducts} margin={{ top: 10, right: 10, left: 0, bottom: 30 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis
                      dataKey="name"
                      tick={{ fontSize: 12 }}
                      angle={-15}
                      textAnchor="end"
                      interval={0}
                    />
                    <YAxis tick={{ fontSize: 12 }} />
                    <Tooltip />
                    <Bar dataKey="sales" fill="#0d6efd" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>
        </div>

        <div className="col-lg-4">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body">
              <h6 className="card-title fw-semibold mb-3">
                <i className="bi bi-trophy me-2"></i>
                Best Sellers
              </h6>
              <ul className="list-group list-group-flush">
                {topProducts.map((p, idx) => (
                  <li
                    key={p.name}
                    className="list-group-item d-flex justify-content-between align-items-center px-0"
                  >
                    <span>
                      <span className="badge text-bg-primary rounded-pill me-2">{idx + 1}</span>
                      {p.name}
                    </span>
                    <span className="text-muted small">{p.sales} sold</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
