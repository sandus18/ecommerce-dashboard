function SearchBar({ value, onChange, placeholder = "Search..." }) {
  return (
    <div className="input-group">
      <span className="input-group-text bg-white">
        <i className="bi bi-search"></i>
      </span>
      <input
        type="text"
        className="form-control"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-label="Search"
      />
      {value && (
        <button
          className="btn btn-outline-secondary"
          type="button"
          onClick={() => onChange("")}
          title="Clear search"
        >
          <i className="bi bi-x-lg"></i>
        </button>
      )}
    </div>
  );
}

export default SearchBar;
