import React, { useEffect, useState } from 'react';
import { useFormik } from 'formik';
import { Link, useNavigate } from 'react-router-dom';
import './register.css';
import api from '../api';
import config from '../config';
import * as yup from 'yup';
import toast, { Toaster } from "react-hot-toast";

function Register() {
  const [isLoading, setisLoading] = useState(false);
  const [errorMessage, seterrorMessage] = useState('');
  const [categories, setCategories] = useState([]);
  let url_api = config.api + "/categories?page=1&per_page=100";
  const nav = useNavigate();

  async function handleRegister(values) {
    try {
      setisLoading(true);
      let response = await api.post(`${config.auth}/sign-up`, values);
      if (response.status === 201) {
        setisLoading(false);
        toast.success(response.data.message);
        setTimeout(() => {
          nav('/activate');
        }, 3000);
      } else {
        setisLoading(false);
      }
    } catch (error) {
      console.error(error);
      setisLoading(false);
      seterrorMessage(`${JSON.stringify(error.response.data.validation_error)}`);
    }
    setisLoading(false);
  }

  const validShceme = yup.object({
    name: yup.string().required().min(3, 'Name cannot be less than 3 characters').max(142, 'Name cannot be more than 142 characters'),
    email: yup.string().email().required(),
    password: yup.string().required().matches("^(?=.*\\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$", 'Minimum eight characters, at least one uppercase letter, one lowercase letter, and one number'),
    confirmPassword: yup.string().required().matches("^(?=.*\\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$", 'Minimum eight characters, at least one uppercase letter, one lowercase letter, and one number').oneOf([yup.ref('password')], "Password doesn't match"),
    role: yup.string().required(),
    age: yup.number().min(16).max(60),
    interestedIn: yup.string().notRequired()
  });
  
  let formik = useFormik({
    initialValues: {
      email: '',
      name: '',
      password: '',
      confirmPassword: '',
      role: '',
      age: '',
      interestedIn: '',
    },
    validationSchema: validShceme,
    onSubmit: handleRegister,
  });

  const roleOptions = [
    { name: 'Student', val: '2' },
    { name: 'Instructor', val: '1' },
  ];

  useEffect(() => {
    api
      .get(url_api)
      .then((response) => {
        if (response.status === 200) {
          setCategories(response.data);
        }
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  return (
    <>
      <div className="registration-container">
        <h3>Register Now</h3>
        {errorMessage.length > 0 ? (
          <div className="alert alert-danger">{errorMessage}</div>
        ) : null}
        <form onSubmit={formik.handleSubmit}>
          <label htmlFor="email">Email:</label>
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

          <label htmlFor="name">Name:</label>
          <input
            type="text"
            name="name"
            id="name"
            value={formik.values.name}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            required
          />
          {formik.errors.name && formik.touched.name ? (
            <div className="alert alert-danger">{formik.errors.name}</div>
          ) : null}

          <label htmlFor="password">Password:</label>
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

          <label htmlFor="age">Age:</label>
          <input
            type="number"
            min="16"
            max="60"
            id="age"
            name="age"
            value={formik.values.age}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          {formik.errors.age && formik.touched.age ? (
            <div className="alert alert-danger">{formik.errors.age}</div>
          ) : null}

          <label htmlFor="role">Register As:</label>
          <select
            id="role"
            name="role"
            value={formik.values.role}
            onChange={(e) => {
              formik.handleChange(e);
              formik.setFieldValue('interestedIn', '');
            }}
            onBlur={formik.handleBlur}
            required
          >
            <option value="" disabled>
              Register As:
            </option>
            {roleOptions.map((option) => (
              <option key={option.name} value={option.val}>
                {option.name}
              </option>
            ))}
          </select>
          {formik.errors.role && formik.touched.role ? (
            <div className="alert alert-danger">{formik.errors.role}</div>
          ) : null}

          {formik.values.role === '2' && (
            <div>
              <label htmlFor="interestedIn">Interested In:</label>
              <select
                id="interestedIn"
                name="interestedIn"
                value={formik.values.interestedIn}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                required={formik.values.role === '2'}
              >
                <option value="" disabled>
                  Interested In:
                </option>
                {categories.map((category, index) => (
                  <option key={category.id || index} value={category.id}>
                    {category.name}
                  </option>
                )
                )}
              </select>
              {formik.errors.interestedIn && formik.touched.interestedIn ? (
                <div className="alert alert-danger">{formik.errors.interestedIn}</div>
              ) : null}
            </div>
          )}

          <div className="container">
            {isLoading ? (
              <button type="button" className="register-button">
                <i className="fas fa-spinner fa-spin"></i>
              </button>
            ) : (
              <button
                className="register-button"
                disabled={!formik.dirty && formik.isValid}
                type="submit"
                onSubmit={handleRegister}
              >
                Register
              </button>
            )}
          </div>
        </form>
        <div className="container">
          Already Have An Account? <Link to="/login">Login Here</Link>
        </div>
        <div className="container">
          want to activate your email?<Link to="/activate"> Activate Here</Link>
        </div>
        <Toaster />
      </div>
    </>
  );
}

export default Register;
