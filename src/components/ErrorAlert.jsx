function ErrorAlert({ message, onRetry }) {
  return (
    <div className="alert alert-danger d-flex align-items-center justify-content-between" role="alert">
      <div>
        <i className="bi bi-exclamation-triangle-fill me-2"></i>
        {message || "Something went wrong."}
      </div>
      {onRetry && (
        <button className="btn btn-sm btn-outline-danger" onClick={onRetry}>
          <i className="bi bi-arrow-clockwise me-1"></i> Retry
        </button>
      )}
    </div>
  );
}

export default ErrorAlert;
