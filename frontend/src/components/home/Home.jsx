import React, { useEffect, useState } from "react";
import Slider from "../slider/Slider";
import Loading from "../Loading/loading";
import "./home.css";
import api from "../api";
import config from "../config";
import Categories from "../categories/Categories";
import { MDBContainer, MDBRow } from "mdb-react-ui-kit";
import Search from "../search/search";

function Home(props) {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  let url_api = config.api + "/categories?page=1&per_page=20";

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

  return (
    <>
      <Search />
      <br />
      {loading ? (
        <Loading />
      ) : (
        <div className="row">
          <MDBContainer>
            <MDBRow>
            <Slider />
            </MDBRow>
            <br />
            <br />
          </MDBContainer>
          <hr />
          <Categories categories={categories}/>
        </div>
      )}
    </>
  );
}
export default Home;
