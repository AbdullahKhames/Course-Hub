import { useNavigate } from "react-router-dom";
import "./search.css";

function Search() {
  const navigate = useNavigate();
  return (
    <form
      className="d-flex mx-auto search-form"
      onSubmit={(e) => {
        e.preventDefault();
        const query = e.target.elements.search.value;
        if (!query) return;
        if (window.location.pathname === "/courses/filter/") {
          window.location.reload();
        }

        navigate(`/courses/filter/`, { state: { query } });  // to improve the search functionality, we can add a query parameter to the URL
      }}
    >
      <input
        className="form-control me-2 custom-search-input"
        type="search"
        placeholder="Search"
        aria-label="Search"
        name="search"
      />
      <button className="btn btn-outline-success basic" type="submit">
        Search
      </button>
    </form>
  );
}

export default Search;
