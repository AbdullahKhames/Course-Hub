import { useNavigate } from "react-router-dom";

function Search() {
  const navigate = useNavigate();
  return (
    <form
      className="d-flex mx-auto"
      onSubmit={(e) => {
        e.preventDefault();
        const query = e.target.elements.search.value;
        if (!query) return;
        // i want to check if the url is /courses/filter/?* to refresh the page
        if (window.location.pathname === "/courses/filter/") {
          window.location.reload();
        }
    
        navigate(`/courses/filter/`, { state: { query } });
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
