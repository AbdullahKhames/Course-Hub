import React from "react";
import { MDBContainer, MDBRow } from "mdb-react-ui-kit";
import CourseList from "../courses/CourseList";
import api from "../api";
import config from "../config";
import { useEffect, useState } from "react";
import Loading from "../Loading/loading";
import { Link } from "react-router-dom";
import "./Categories.css";

function Categories({ categories }) {
  const [_categories, setCategories] = useState(categories);
  const [loading, setLoading] = useState(true);
  const url_api = config.api + "/categories?page=1&per_page=50";

  useEffect(() => {
    if (!categories) {
      api
        .get(url_api)
        .then((response) => {
          if (response.status === 200) {
            setCategories(response.data);
            setLoading(false);
          }
        })
        .catch((error) => {
          console.error(error);
        });
    } else {
      setLoading(false);
    }
  }, []);

  if (loading) {
    return <Loading />;
  } else if (_categories.length === 0) {
    return <div>No categories found</div>;
  } else {
    return (
      <div className="row">
        <MDBContainer className="py-4">
          <MDBRow>
            {_categories.map((category, index) => (
              <>
                {category.courses.length > 0 && (
                  <>
                    
                      <Link
                        to={"/categories/" + category.id}
                        className="head-link"
                      >
                        <div className="SubHeading box" key={category.id || index}>
                        <h2>{category.name}</h2>
                        </div>
                      </Link>
                    
                    <CourseList filter={category} />
                  </>
                )}
              </>
            ))}
          </MDBRow>
        </MDBContainer>
      </div>
    );
  }
}

export default Categories;
