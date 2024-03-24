import React, { useContext, useEffect, useState } from "react";
import api from "../api";
import config from "../config";
import { UserDataContext } from "../UserContextProvider/UserContextProvider";
import { useNavigate } from "react-router-dom";
import Loading from "../Loading/loading";
import UserProfile from "./userProfile";

function Profile() {
  const userContext = useContext(UserDataContext);
  const [loading, setLoading] = useState(true);
  const userData = userContext.userData;
  const [data, setData] = useState({});
  const navigate = useNavigate();

  useEffect(() => {

    if (userData === null) {
      return;
    }
    const url_api = config.api + "/users/" + userData.id + "?all=true";
    api
      .get(`${url_api}`)
      .then((res) => {
        if (res.status === 200) {
          setData(res.data);
          setLoading(false);
        }
      })
      .catch((err) => {
        console.error(err);
      });
  }, [userData]);
  if (loading) {
    return <Loading />;
  } else {
    return (
      <>
        {userData === null ? (
          navigate("/login")
        ) : (
          <UserProfile data={data} owner={true} />
        )}
      </>
    );
  }
}

export default Profile;
