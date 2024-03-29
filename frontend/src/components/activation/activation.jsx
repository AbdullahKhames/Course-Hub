import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import { Link, useNavigate } from "react-router-dom";
import "./activation.css";
import * as yup from "yup";
import config from "../config";
import api from "../api";
import { useLocation } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";

export default function Activation() {

  const location = useLocation();
  const [isLoading, setisLoading] = useState(false);
  const [errorMessage, seterrorMessage] = useState("");
  const [popupData, setPopupData] = useState(null);
  const nav = useNavigate();

  async function handleLogin(values) {
    try {
      setisLoading(true);
      let response = await api.post(`${config.auth}/activate`, values);
      if (response.status === 200) {
        setisLoading(false);
        toast.success(response.data.message);
        if(response.data?.data){
          // setadminToken(response.data.data);
          setPopupData(response.data.data)
        }
        else{
          setTimeout(() => {
            nav('/login');
          }, 2000);
        }
      } else {
        setisLoading(false);
      }
    } catch (error) {
      setisLoading(false);
      seterrorMessage(`${JSON.stringify(error.response.data.error)}`);
    }
  }

  async function handleRequestActivation(email) {
    try {
      setisLoading(true);
      let response = await api.post(`${config.auth}/request-activation-token`, { email });
      if (response.status === 200) {
        setisLoading(false);
        toast.success(response.data.message);
      } else {
        setisLoading(false);
      }
    } catch (error) {
      setisLoading(false);
      seterrorMessage(`${JSON.stringify(error.response.data.error)}`);
    }
  }

  const validShceme = yup.object({
    email: yup.string().email().required(),
    activation_token: yup.string().required(),
  });

  let formik = useFormik({
    initialValues: {
      email: "",
      activation_token: "",
    },
    validationSchema: validShceme,
    onSubmit: handleLogin,
  });

  useEffect(() => {
    if (location.state && location.state.error) {
      toast.error(location.state.error, {
        duration: 5000,
      });
    }
  }, []);

  return (
    <>
      <div className="registration-container">
        <h3>Activate Now</h3>
        {errorMessage.length > 0 ? (
          <div className="alert alert-danger">{errorMessage}</div>
        ) : null}
        {popupData && (
        <div className="popup">
          <div className="popup-inner">
            <h2>Data Received</h2>
            <p>{popupData}</p>
            <button onClick={() => {
              setPopupData(null);
              nav('/login')
              }}>Close</button>
          </div>
        </div>
      )}
        <form onSubmit={formik.handleSubmit}>
          <label htmlFor="email">Email :</label>
          <input
            type="email"
            name="email"
            id="email"
            value={formik.values.email}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            required
          />
          {formik.errors.email && formik.touched.email ? (
            <div className="alert alert-danger">{formik.errors.email}</div>
          ) : null}

          <label htmlFor="activation_token">Activation Token :</label>
          <input
            type="text"
            name="activation_token"
            id="activation_token"
            value={formik.values.activation_token}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            required
          />
          {formik.errors.activation_token && formik.touched.activation_token ? (
            <div className="alert alert-danger">{formik.errors.activation_token}</div>
          ) : null}

          <p></p>
          {isLoading ? (
            <button type="button" className="register-button">
              <i className="fas fa-spinner fa-spin"></i>
            </button>
          ) : (
            <button
              className="register-button"
              disabled={!formik.dirty && formik.isValid}
              type="submit"
              onSubmit={handleLogin}
            >
              Activate Now
            </button>
            
          )}
          Didn't receive activation token ?
          <button
            type="button"
            className="register-button"
            onClick={() => handleRequestActivation(formik.values.email)}
            disabled={isLoading}
          >
           Request activation token now
        </button>
        <Toaster />
        </form>


        <div className="container">
          Don't Have An Account? <Link to="/register">Register Here</Link>
        </div>
        <div className="container">
          Already Have An Account? <Link to="/login">Login Here</Link>
        </div>
      </div>
    </>
  );
}
