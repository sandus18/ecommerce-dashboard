function StatCard({ title, value, icon, color = "primary" }) {
  return (
    <div className="card border-0 shadow-sm h-100">
      <div className="card-body d-flex align-items-center gap-3">
        <div
          className={`rounded-circle d-flex align-items-center justify-content-center bg-${color}-subtle text-${color}`}
          style={{ width: 56, height: 56, fontSize: "1.5rem" }}
        >
          <i className={`bi ${icon}`}></i>
        </div>
        <div>
          <div className="text-muted small text-uppercase">{title}</div>
          <div className="fs-4 fw-bold">{value}</div>
        </div>
      </div>
    </div>
  );
}

export default StatCard;
