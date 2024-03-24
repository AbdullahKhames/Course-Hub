import React from "react";
import api from "../api";
import config from "../config";
import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Loading from "../Loading/loading";
import UserProfile from "../Profile/userProfile";

function UserPage() {
  const { id } = useParams();
  const url_api = config.api + "/users/" + id + "?all=true";
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    api
      .get(`${url_api}`)
      .then((res) => {
        if (res.status === 200) {
          setData(res.data);
          setLoading(false);
        }
      })
      .catch((err) => {
        if (err.response.status === 401) {
          navigate("/forbidden");
        } else {
          navigate("/not-found");
        }
        return;
      });
  }, []);

  if (loading) {
    return <Loading />;
  } else {
    return <UserProfile data={data} owner={false} />;
  }
}

export default UserPage;
