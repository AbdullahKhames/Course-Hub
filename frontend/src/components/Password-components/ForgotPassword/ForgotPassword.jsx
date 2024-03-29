import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import { Link, useNavigate } from "react-router-dom";
import "./ForgotPassword.css";
import * as yup from "yup";
import config from "../../config";
import api from "../../api";
import { useLocation } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";

export default function ForgotPassword() {

  const location = useLocation();
  const [isLoading, setisLoading] = useState(false);
  const [errorMessage, seterrorMessage] = useState("");
  const nav = useNavigate();

  async function handleLogin(values) {
    try {
      setisLoading(true);
      let response = await api.post(`${config.auth}/forgot-password`, values);
      if (response.status === 201) {
        setisLoading(false);
        toast.success(response.data.message);
        setTimeout(() => {
          nav('/reset-password');
        }, 2000);
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
  });
  let formik = useFormik({
    initialValues: {
      email: "",
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
        <h3>Forget Password</h3>
        {errorMessage.length > 0 ? (
          <div className="alert alert-danger">{errorMessage}</div>
        ) : null}
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
              Request Reset Password Token
            </button>
          )}
        </form>
        {/* <div className="container">
          dont Have An Account ?<Link to="/register"> Register Here</Link>
        </div>
        <div className="container">
          Already Have An Account? <Link to="/login">Login Here</Link>
        </div> */}
        <Toaster />
      </div>
    </>
  );
}
