import { useState, useEffect, useMemo, useCallback } from "react";
import { getOrders } from "../services/apiService";
import SearchBar from "../components/SearchBar";
import StatusBadge from "../components/StatusBadge";
import Pagination from "../components/Pagination";
import Loading from "../components/Loading";
import ErrorAlert from "../components/ErrorAlert";

const PAGE_SIZE = 8;
const STATUSES = ["All", "Delivered", "Pending", "Shipped", "Cancelled"];

function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("All");
  const [sortOrder, setSortOrder] = useState("desc");
  const [page, setPage] = useState(1);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getOrders();
      setOrders(res.data);
    } catch (err) {
      setError(err.message || "Failed to load orders.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const filteredOrders = useMemo(() => {
    let result = orders.filter(
      (o) =>
        o.customer.toLowerCase().includes(search.toLowerCase()) ||
        String(o.id).includes(search)
    );

    if (status !== "All") {
      result = result.filter((o) => o.status === status);
    }

    result = [...result].sort((a, b) => {
      const dateA = new Date(a.date);
      const dateB = new Date(b.date);
      return sortOrder === "asc" ? dateA - dateB : dateB - dateA;
    });

    return result;
  }, [orders, search, status, sortOrder]);

  const totalAmount = useMemo(
    () => filteredOrders.reduce((sum, o) => sum + (o.total || 0), 0),
    [filteredOrders]
  );

  const totalPages = Math.max(1, Math.ceil(filteredOrders.length / PAGE_SIZE));
  const paginatedOrders = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return filteredOrders.slice(start, start + PAGE_SIZE);
  }, [filteredOrders, page]);

  const handleFilterChange = useCallback((setter) => (value) => {
    setter(value);
    setPage(1);
  }, []);

  if (loading) return <Loading label="Loading orders..." />;
  if (error)
    return (
      <div className="container-fluid px-4 py-4">
        <ErrorAlert message={error} onRetry={fetchOrders} />
      </div>
    );

  return (
    <div className="container-fluid px-4 py-4">
      <h3 className="fw-bold mb-4">Orders</h3>

      <div className="card border-0 shadow-sm mb-4">
        <div className="card-body">
          <div className="row g-3 align-items-end">
            <div className="col-md-5">
              <label className="form-label small text-muted mb-1">Search</label>
              <SearchBar
                value={search}
                onChange={handleFilterChange(setSearch)}
                placeholder="Search by customer or order ID..."
              />
            </div>
            <div className="col-md-3 col-6">
              <label className="form-label small text-muted mb-1">Status</label>
              <select
                className="form-select"
                value={status}
                onChange={(e) => handleFilterChange(setStatus)(e.target.value)}
              >
                {STATUSES.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>
            <div className="col-md-4 col-6">
              <label className="form-label small text-muted mb-1">Sort by Date</label>
              <select
                className="form-select"
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value)}
              >
                <option value="desc">Newest First</option>
                <option value="asc">Oldest First</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <div className="d-flex flex-wrap justify-content-between align-items-center mb-2">
        <div className="text-muted small">
          Showing {paginatedOrders.length} of {filteredOrders.length} orders
        </div>
        <div className="fw-semibold">
          Total: <span className="text-primary">₹{totalAmount.toLocaleString()}</span>
        </div>
      </div>

      <div className="card border-0 shadow-sm">
        <div className="card-body">
          {paginatedOrders.length === 0 ? (
            <div className="text-center text-muted py-5">
              <i className="bi bi-inbox fs-1 d-block mb-2"></i>
              No orders found.
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover align-middle">
                <thead className="table-light">
                  <tr>
                    <th>Order ID</th>
                    <th>Customer</th>
                    <th>Date</th>
                    <th>Items</th>
                    <th>Total</th>
                    <th>Status</th>
                    <th className="text-end">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedOrders.map((order) => (
                    <tr key={order.id}>
                      <td className="fw-semibold">#{order.id}</td>
                      <td>{order.customer}</td>
                      <td>{order.date}</td>
                      <td>{order.items}</td>
                      <td>₹{order.total.toLocaleString()}</td>
                      <td>
                        <StatusBadge status={order.status} />
                      </td>
                      <td className="text-end">
                        <button
                          className="btn btn-sm btn-outline-primary"
                          onClick={() => setSelectedOrder(order)}
                        >
                          <i className="bi bi-eye"></i> View
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      <div className="mt-4">
        <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
      </div>

      {selectedOrder && (
        <>
          <div className="modal fade show d-block" tabIndex="-1" role="dialog">
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Order #{selectedOrder.id}</h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => setSelectedOrder(null)}
                  ></button>
                </div>
                <div className="modal-body">
                  <dl className="row mb-0">
                    <dt className="col-5">Customer</dt>
                    <dd className="col-7">{selectedOrder.customer}</dd>

                    <dt className="col-5">Date</dt>
                    <dd className="col-7">{selectedOrder.date}</dd>

                    <dt className="col-5">Items</dt>
                    <dd className="col-7">{selectedOrder.items}</dd>

                    <dt className="col-5">Status</dt>
                    <dd className="col-7">
                      <StatusBadge status={selectedOrder.status} />
                    </dd>

                    <dt className="col-5">Total Amount</dt>
                    <dd className="col-7 fw-bold text-primary">
                      ₹{selectedOrder.total.toLocaleString()}
                    </dd>
                  </dl>
                </div>
                <div className="modal-footer">
                  <button
                    className="btn btn-outline-secondary"
                    onClick={() => setSelectedOrder(null)}
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="modal-backdrop fade show"></div>
        </>
      )}
    </div>
  );
}

export default Orders;
