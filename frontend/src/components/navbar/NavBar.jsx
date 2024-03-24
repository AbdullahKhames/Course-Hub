import React, { useContext, useEffect } from "react";
import { Link } from "react-router-dom";
import "./navbar.css";
import logo from "../../assets/images/online-course.ico";
import api from "../api";
import config from "../config";
import Loading from "../Loading/loading";
import { UserDataContext } from "../UserContextProvider/UserContextProvider";

export default function NavBar(props) {
  let userContext = useContext(UserDataContext);
  let userData = userContext.userData;

  const [categories, setCategories] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const url_api = config.api + "/categories?page=1&per_page=20";

  useEffect(() => {
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
  }, []);

  useEffect(() => {
    console.log("userData changed");
  }, [userData]);
  return (
    <>
      <nav className="navbar navbar-expand-lg bg-body-tertiary">
        <div className="container-fluid">
          <div className="logo-container">
          <Link to="/">
            <div className="logo">
              <img src={logo} alt="Logo" />
            </div>
          </Link>
          </div>
          <Link className="navbar-brand" to="/">
            Course Hub
          </Link>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarSupportedContent"
            aria-controls="navbarSupportedContent"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              {/* Left side navigation */}
              <li className="nav-item">
                <Link className="nav-link active" aria-current="page" to="/">
                  Home
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/about">
                  About
                </Link>
              </li>
              {/* <li className="nav-item">
                <Link className="nav-link" to="/contact-us">
                  Contact Us
                </Link>
              </li> */}
              <li className="nav-item dropdown">
                <Link
                  className="nav-link dropdown-toggle"
                  to="/categories"
                  role="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  Categories
                </Link>
                <ul className="dropdown-menu">
                  {loading ? <Loading /> : categories.map((category, index) => (
                    <li key={category.id || index}>
                      <Link
                        className="dropdown-item"
                        to={"/categories/" + category.id}
                      >
                        {category.name}
                      </Link>
                    </li>
                  ))}
                  <li>
                    <hr className="dropdown-divider" />
                  </li>
                  <li>
                    <Link className="dropdown-item" to="/categories">
                      All Categories
                    </Link>
                  </li>
                </ul>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/courses">
                  Courses
                </Link>
              </li>
              {userData && userData.role === 1 ? (
                <>
                  <li className="nav-item">
                    <Link className="nav-link" to="/Instructor">
                      Instructor
                    </Link>
                  </li>
                </>
              ) : null}
              {userData && userData.role === 0 ? (
                <>
                  <li className="nav-item">
                    <Link className="nav-link" to="/Admin">
                      Admin
                    </Link>
                  </li>
                </>
              ) : null}
            </ul>
            {/* Right side navigation */}

            <ul className="navbar-nav">
              {userData === null ? (
                <>
                  <li className="nav-item">
                    <Link className="nav-link" to="/register">
                      Register
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link className="nav-link" to="/login">
                      Login
                    </Link>
                  </li>
                </>
              ) : (
                <>
                  <li className="nav-item">
                    <Link className="nav-link" to="/profile">
                      {userData.name}
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link className="nav-link" to="/logout">
                      Logout
                    </Link>
                  </li>
                </>
              )}
            </ul>
          </div>
        </div>
      </nav>
    </>
  );
}
