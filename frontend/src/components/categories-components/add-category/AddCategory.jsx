import { useFormik } from 'formik';
import React, { useState } from 'react'
import * as Yup from 'yup'
import api from '../../api';
import config from '../../config';
import toast, { Toaster } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
export default function AddCategory() {
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, seterrorMessage] = useState('')
    const nav = useNavigate();
    function handleCategorySubmit(values) {
        setIsLoading(true);

        api.post(`${config.api}/categories`, values)
        .then((response) => {
            if (response.status === 201) {
                toast.success('category added successfully');
            }
            setIsLoading(false);
        })
        .catch((err) => {
            if (err.response.status === 401){
                localStorage.removeItem('access_token');
                localStorage.removeItem('refresh_token');    
                nav('/login');
                window.location.reload();
              }
              setIsLoading(false);
              toast.error("error saving category");
            console.error(err);
            seterrorMessage(`${JSON.stringify(err.response.data)}`);

        })
    }
    const validScheme = Yup.object().shape({
        name : Yup.string().required().min(3)
    })
    const formik = useFormik({
        initialValues:{
            name:''
        },
        validationSchema:validScheme,
        onSubmit: handleCategorySubmit
    })
  return <>
    <div>

        
        <h1>Add a New Category</h1>
        {errorMessage.length > 0 ?   
        <div className="alert alert-danger">
            {errorMessage}
        </div> :null}

        <form onSubmit={formik.handleSubmit}>
        <label htmlFor="name">category Name:</label>
                <input
                type="text"
                name="name"
                id = "name"
                placeholder='category name'
                value={formik.values.name}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                required
                />
        {formik.errors.name && formik.touched.name ? <div className="alert alert-danger">{formik.errors.name}</div> : null}
        {isLoading ?  
        <button type='button' className='register-button'><i className='fas fa-spinner fa-spin'></i></button> :
        <button  className='btn btn-primary btn-lg btn-block' disabled={!formik.dirty && formik.isValid} type="submit" onSubmit={handleCategorySubmit} >create Category</button>}
        <Toaster/>
        </form>
    </div>
  </>
}
