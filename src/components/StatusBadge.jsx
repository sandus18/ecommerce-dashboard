const STATUS_STYLES = {
  Delivered: "success",
  Pending: "warning",
  Shipped: "info",
  Cancelled: "danger",
};

function StatusBadge({ status }) {
  const variant = STATUS_STYLES[status] || "secondary";
  return <span className={`badge rounded-pill text-bg-${variant}`}>{status}</span>;
}

export default StatusBadge;
