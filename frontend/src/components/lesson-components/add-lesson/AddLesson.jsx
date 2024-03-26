import React, {useState, useEffect} from 'react'
// import { UserDataContext } from '../../UserContextProvider/UserContextProvider';
// import { useContext } from 'react';
import * as Yup from 'yup'
import config from '../../config';
import { useLocation, useNavigate } from 'react-router-dom';
import { useFormik} from 'formik';
import toast, { Toaster } from 'react-hot-toast';
import './addLesson.css'
import Loading from '../../Loading/loading';
import api from '../../api';

export default function AddLesson(props) {
  // const userContext = useContext(UserDataContext);
    // const userData = userContext.userData;
    const [loading, setLoading] = useState(true);
    const [isLoading, setisLoading] = useState(false)
    const [errorMessage, seterrorMessage] = useState('')
    const nav = useNavigate();
    const location = useLocation();
    const { sectionData } = location.state || {};
  
  useEffect(() => {
    if (sectionData) {
      setLoading(false);
    }
  }, [])

    const lessonSchema = Yup.object().shape({
      name: Yup.string()
        .required('Required'),
      lesson_num: Yup.number(),
      completed: Yup.boolean(),
      content: Yup.string().required()
    })
                
    async function handlelessonSubmit(values) {
      seterrorMessage('');
      try {
        setisLoading(true);
        let response = await api.post(`${config.api}/sections/${sectionData.id}/lessons`, values);
        if (response.status === 201)
        {
          setisLoading(false);
            toast.success('lesson saved successfully!', {
                position: 'top-center',
                autoClose: 3000, 
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
            });
        } else {
          setisLoading(false);
        }
     } catch (error) {
      setisLoading(false);
      if (error.response.status === 401){
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');    
        nav('/login');
        window.location.reload();
      }
      setisLoading(false);
      console.error(error);
      seterrorMessage(`${JSON.stringify(error.response.data)}`);
    }
    setisLoading(false);
    }
  

    const formik = useFormik({
      initialValues : {
        name: '',
        lesson_num: 1,
        completed: false,
        content: ''
      },
      validationSchema:lessonSchema,
      onSubmit: handlelessonSubmit
    });
    if (loading){
        return <Loading />
    }
    else {
    return <>
        <div>

            <h1>Add a New lesson</h1>
            {errorMessage.length > 0 ?   
            <div className="alert alert-danger">
            {errorMessage}
            </div> : null}

            <form onSubmit={formik.handleSubmit}>


        <div className="lesson">
          <h2>lesson</h2>
          <input
            id = {`name`}
            name={`name`}
            placeholder="lesson Name"
            onChange={formik.handleChange}
                onBlur={formik.handleBlur}
            value={formik.name}
          />
        {formik.errors.name && formik.errors.name && formik.touched.name ? (
        <div className="alert alert-danger">{formik.errors.name}</div>
        ) : null}
          <input
          id = {`lesson_num`}
            name={`lesson_num`}
            placeholder="lesson Number"
            type="number"
            onChange={formik.handleChange}
                onBlur={formik.handleBlur}
            value={formik.lesson_num}
          />
        {formik.errors && formik.errors?.lesson_num && formik.touched?.lesson_num ? (
            <div className="alert alert-danger">{formik.errors.lesson_num}</div>
            ) : null}
          <input
            lesson_num={`completed`}
            type="checkbox"
            id = {`completed`}
            name={`completed`}
            onChange={formik.handleChange}
                onBlur={formik.handleBlur}
            checked={formik.completed}
          />
            <textarea
                id = "content"
                  name="content"
                  placeholder="Lesson Content"
                  className="form-field textarea-field"
                  onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                  value={formik.content}
                />
        {formik.errors && formik.errors?.content && formik.touched?.content ? (
            <div className="alert alert-danger">{formik.errors.content}</div>
            ) : null}
        </div>
      
    <p></p>

        {isLoading ?  
        <button type='button' className='register-button'><i className='fas fa-spinner fa-spin'></i></button> :
        <button  className='btn btn-primary btn-lg btn-block' disabled={!formik.dirty && formik.isValid} type="submit" onSubmit={handlelessonSubmit} >create lesson</button>}
        <Toaster/>
        </form>
    </div>
     </>
    }
}
