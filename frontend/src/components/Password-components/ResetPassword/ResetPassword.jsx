import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import { Link, useNavigate } from "react-router-dom";
import "./ResetPassword.css";
import * as yup from "yup";
import config from "../../config";
import api from "../../api";
import { useLocation } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";

export default function ResetPassword() {

  const location = useLocation();
  const [isLoading, setisLoading] = useState(false);
  const [errorMessage, seterrorMessage] = useState("");
  const nav = useNavigate();

  async function handleLogin(values) {
    try {
      setisLoading(true);
      let response = await api.post(`${config.auth}/reset-password`, values);
      if (response.status === 200) {
        setisLoading(false);
        toast.success(response.data.message);
        setTimeout(() => {
          nav('/login');
        }, 2000);
      } else {
        setisLoading(false);
      }
    } catch (error) {
      setisLoading(false);
      seterrorMessage(`${JSON.stringify(error.response.data.error)}`);
    }
    setisLoading(false);
  }

  const validShceme = yup.object({
    email: yup.string().email().required(),
    reset_token: yup
      .string()
      .required(),
      password: yup.string().required().matches("^(?=.*\\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$", 'Minimum eight characters, at least one uppercase letter, one lowercase letter, and one number'),
      confirmPassword: yup.string().required().matches("^(?=.*\\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$", 'Minimum eight characters, at least one uppercase letter, one lowercase letter, and one number').oneOf([yup.ref('password')], "Password doesn't match"),
  });
  let formik = useFormik({
    initialValues: {
      email: "",
      reset_token: "",
      password: '',
      confirmPassword: '',
    },
    validationSchema: validShceme,
    onSubmit: handleLogin,
  });

  // useEffect(() => {
  //   if (location.state && location.state.error) {
  //     toast.error(location.state.error, {
  //       duration: 5000,
  //     });
  //   }
  // }, []);

  return (
    <>
      <div className="registration-container">
        <h3>Reset Password Now</h3>
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

          <label htmlFor="reset_token">Reset Token :</label>
          <input
            type="text"
            name="reset_token"
            id="reset_token"
            value={formik.values.reset_token}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            required
          />
          {formik.errors.reset_token && formik.touched.reset_token ? (
            <div className="alert alert-danger">{formik.errors.reset_token}</div>
          ) : null}
          <label htmlFor="password"> New Password:</label>
          <input
            type="password"
            name="password"
            value={formik.values.password}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            required
          />
          {formik.errors.password && formik.touched.password ? (
            <div className="alert alert-danger">{formik.errors.password}</div>
          ) : null}

          <label htmlFor="confirmPassword">Confirm Password:</label>
          <input
            type="password"
            name="confirmPassword"
            id="confirmPassword"
            value={formik.values.confirmPassword}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            required
          />
          {formik.errors.confirmPassword && formik.touched.confirmPassword ? (
            <div className="alert alert-danger">{formik.errors.confirmPassword}</div>
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
              Reset Password Now
            </button>
          )}
          <Toaster />
        </form>
        {/* <div className="container">
          dont Have An Account ?<Link to="/register"> Register Here</Link>
        </div>
        <div className="container">
          Already Have An Account? <Link to="/login">Login Here</Link>
        </div> */}
      </div>
    </>
  );
}
