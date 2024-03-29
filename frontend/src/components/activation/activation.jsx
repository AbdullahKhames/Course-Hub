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

  const validScheme = yup.object({
    email: yup.string().email().required(),
    activation_token: yup.string().required(),
  });

  const activationFormik = useFormik({
    initialValues: {
      email: "",
      activation_token: "",
    },
    validationSchema: validScheme,
    onSubmit: handleLogin,
  });

  const requestActivationFormik = useFormik({
    initialValues: {
      email: "",
    },
    validationSchema: yup.object({
      email: yup.string().email().required(),
    }),
    onSubmit: (values) => handleRequestActivation(values.email),
  });

  useEffect(() => {
    if (location.state && location.state.error) {
      toast.error(location.state.error, {
        duration: 5000,
      });
    }
  }, []);

  async function handleLogin(values) {
    try {
      setisLoading(true);
      let response = await api.post(`${config.auth}/activate`, values);
      if (response.status === 200) {
        setisLoading(false);
        toast.success(response.data.message);
        setTimeout(() => {
          nav("/login");
        }, 2000);
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
      if (response.status === 201) {
        setisLoading(false);
        toast.success(response.data.message);
        if (response.data?.data) {
          setPopupData(response.data.data);
        }
      } else {
        setisLoading(false);
      }
    } catch (error) {
      setisLoading(false);
      seterrorMessage(`${JSON.stringify(error.response.data.error)}`);
    }
  }

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
              <button
                onClick={() => {
                  setPopupData(null);
                }}
              >
                Close
              </button>
            </div>
          </div>
        )}
        <form onSubmit={activationFormik.handleSubmit}>
          <label htmlFor="email">Email :</label>
          <input
            type="email"
            name="email"
            id="email"
            value={activationFormik.values.email}
            onChange={activationFormik.handleChange}
            onBlur={activationFormik.handleBlur}
            required
          />
          {activationFormik.errors.email && activationFormik.touched.email ? (
            <div className="alert alert-danger">{activationFormik.errors.email}</div>
          ) : null}

          <label htmlFor="activation_token">Activation Token :</label>
          <input
            type="text"
            name="activation_token"
            id="activation_token"
            value={activationFormik.values.activation_token}
            onChange={activationFormik.handleChange}
            onBlur={activationFormik.handleBlur}
            required
          />
          {activationFormik.errors.activation_token && activationFormik.touched.activation_token ? (
            <div className="alert alert-danger">{activationFormik.errors.activation_token}</div>
          ) : null}

          <p></p>
          {isLoading ? (
            <button type="button" className="register-button">
              <i className="fas fa-spinner fa-spin"></i>
            </button>
          ) : (
            <button
              className="register-button"
              disabled={!activationFormik.dirty && activationFormik.isValid}
              type="submit"
            >
              Activate Now
            </button>
          )}
        </form>

        <form onSubmit={requestActivationFormik.handleSubmit}>
          <p>Didn't recive activation token ?</p>
          <label htmlFor="email">Email :</label>
          <input
            type="email"
            name="email"
            id="email"
            value={requestActivationFormik.values.email}
            onChange={requestActivationFormik.handleChange}
            onBlur={requestActivationFormik.handleBlur}
            required
          />
          {requestActivationFormik.errors.email && requestActivationFormik.touched.email ? (
            <div className="alert alert-danger">{requestActivationFormik.errors.email}</div>
          ) : null}

          <p></p>
          {isLoading ? (
            <button type="button" className="register-button">
              <i className="fas fa-spinner fa-spin"></i>
            </button>
          ) : (
            <button
              type="button"
              className="register-button"
              onClick={requestActivationFormik.handleSubmit}
              disabled={isLoading}
            >
              Request activation token now
            </button>
          )}
        </form>

        <Toaster />
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
