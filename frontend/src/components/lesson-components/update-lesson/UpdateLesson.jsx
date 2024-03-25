  import { useFormik } from 'formik';
  import React, { useEffect, useState } from 'react'
  import { useParams } from 'react-router-dom'
  import * as Yup from 'yup';
  import api from '../../api';
  import config from '../../config';
  import Loading from '../../Loading/loading';
  import toast, { Toaster } from 'react-hot-toast';
  import './updateLesson.css'
  
  export default function UpdateLesson() {
    const [loading, setloading] = useState(true)
    const [isLoading, setisLoading] = useState(false)
    const {id}  = useParams();
    const [lesson, setlesson] = useState({})

  
    useEffect(() => {
      api.get(`${config.api}/lessons/${id}`)
      .then(resp => {
        setlesson(resp.data);
        setloading(false)
      })
      .catch(err => {
        console.error(err);
      })
    }, [])
    function handlelessonSubmit(values){
      setisLoading(true)
      api.put(`${config.api}/lessons/${values.id}`, values)
      .then((resp) => {
        toast.success("updated Successfully");
        setlesson(resp.data)
        setisLoading(false)
      }).catch((err) => {
        console.error(err);
        toast.error("error can't update");
        setisLoading(false)
      })
    }
    const validScheme = Yup.object().shape({
      name: Yup.string().required().min(3),
      lesson_num: Yup.number().required(),
      content: Yup.string().required()
    });
  

    const formik = useFormik({
      initialValues: {
        id: lesson.id,
        name: lesson.name,
        lesson_num: lesson.lesson_num,
        content: lesson.content
      },
      validationSchema: validScheme,
      onSubmit: handlelessonSubmit
    })

    if (loading) {
      return <Loading />
    } else {
      return <>
        <form onSubmit={formik.handleSubmit}>
          <input 
          type="text"
          name="id"
          id="id"
          value={formik.values.id}
          placeholder='lesson id'
          disabled
          required
           />
          <input 
          type="text"
          name="name"
          id="name"
          value={formik.values.name}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          placeholder='lesson name'
          required
           />
           
          {formik.errors.name && formik.touched.name ? 
          <div className="alert alert-danger">{formik.errors.name}</div>:
          null}
          
          <input 
          type="text"
          name="lesson_num"
          id="lesson_num"
          value={formik.values.lesson_num}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          placeholder='lesson number'
          required
           />
           
          {formik.errors.name && formik.touched.name ? 
          <div className="alert alert-danger">{formik.errors.name}</div>:
          null}

          <input 
          type="text"
          name="content"
          id="content"
          value={formik.values.content}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          placeholder='lesson content'
          required
           />
           
          {formik.errors.name && formik.touched.name ? 
          <div className="alert alert-danger">{formik.errors.name}</div>:
          null}
          {isLoading ?  
          <button type='button' className='register-button'><i className='fas fa-spinner fa-spin'></i></button> :
          <button  className='btn btn-primary btn-lg btn-block' disabled={!formik.dirty && formik.isValid} type="submit" onSubmit={handlelessonSubmit} >update Course</button>}
          <Toaster/>
        </form>
      </>
    }
  }