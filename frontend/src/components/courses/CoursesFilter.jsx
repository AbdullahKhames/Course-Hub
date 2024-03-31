import React, { useEffect, useState } from "react";
import CourseList from "./CourseList";
import { useLocation } from "react-router-dom";
import Loading from "../Loading/loading";
import Search from "../search/search";

function CoursesFilter() {
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState(null);

  const location = useLocation();

  useEffect(() => {
    if (location.state) {
      setQuery(location.state.query);
      setLoading(false);
    } else {
      setLoading(false);
    }
  }, [location.state]);

  if (loading) {
    return <Loading />;
  } else {
    return (
      <>
        <Search />
        <div className="row">
          <CourseList query={query}/>
        </div>
      </>
    );
  }
}

export default CoursesFilter;
