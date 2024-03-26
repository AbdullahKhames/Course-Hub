import { useFormik } from 'formik';
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import * as Yup from 'yup';
import api from '../../api';
import config from '../../config';
import toast, { Toaster } from 'react-hot-toast';
import './updateSection.css'
import Loading from '../../Loading/loading';

export default function UpdateSection() {
  const [loading, setloading] = useState(true)
  const [isLoading, setisLoading] = useState(false)
  const {id}  = useParams();
  const [section, setsection] = useState({})
  const [errorMessage, seterrorMessage] = useState('')

  function handlesectionSubmit(values){
    seterrorMessage('');
    setisLoading(true);
    api.put(`${config.api}/sections/${values.id}`, values)
    .then((resp) => {
      toast.success("updated Successfully");
      setsection(resp.data);
      setisLoading(false)
    }).catch((err) => {
      console.error(err);
      toast.error("error can't update");
      seterrorMessage(JSON.stringify(err));
      setisLoading(false);
      console.error(errorMessage)
    })
  }

  const validScheme = Yup.object().shape({
    name: Yup.string().required().min(3),
    section_num: Yup.number().required(),
    lessons: Yup.array().of(
      Yup.object().shape({
        name: Yup.string().required('Required'),
        lesson_num: Yup.number(),
        completed: Yup.boolean(),
        content: Yup.string().required('Required')
      })
    )
  });

  const formik = useFormik({
    initialValues: {
      id: section.id,
      name: section.name,
      section_num: section.section_num,
      lessons: section.lessons || 
      [
        {
          id: '',
          name: '',
          lesson_num: 1,
          completed: false,
          content: '',
        },
      ]
    },
    validationSchema: validScheme,
    onSubmit: handlesectionSubmit
  });

  useEffect(() => {
    const fetchSectionData = async () => {
      try {
        const response = await api.get(`${config.api}/sections/${id}`);
        const sectionData = response.data;

        setsection(sectionData);
        setloading(false);

        // Update formik values after setting section data
        formik.setValues({
          ...formik.values,
          id: sectionData.id,
          name: sectionData.name,
          section_num: sectionData.section_num,
          lessons: sectionData.lessons || []
        });
      } catch (error) {
        console.error(error);
        seterrorMessage(JSON.stringify(error));
      }
    };

    fetchSectionData();
  }, []);
    // Function to add a new empty lesson to the form
    const addLesson = () => {
      formik.setFieldValue('lessons', [...formik.values.lessons, {
        id: null,
        name: '',
        lesson_num: formik.values.lessons.length + 1,
        completed: false,
        content: ''
      }]);
    };
  
    // Function to remove a lesson from the form
    const removeLesson = (index) => {
      const updatedLessons = [...formik.values.lessons];
      updatedLessons.splice(index, 1);
      formik.setFieldValue('lessons', updatedLessons);
    };

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
        placeholder='section id'
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
        placeholder='section name'
        required
         />
         
        {formik.errors.name && formik.touched.name ? 
        <div className="alert alert-danger">{formik.errors.name}</div>:
        null}
        
        <input 
        type="text"
        name="section_num"
        id="section_num"
        value={formik.values.section_num}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        placeholder='section number'
        required
         />
         
        {formik.errors.name && formik.touched.name ? 
        <div className="alert alert-danger">{formik.errors.section_num}</div>:
        null}
         {/* Lessons Section */}
      <div className="lessons-section">
        <h2>Lessons</h2>
        {formik.values.lessons.map((lesson, index) => (
          <div key={index} className="lesson">
              <input
              type="text"
              id={`lessons.${index}.id`}
              name={`lessons.${index}.id`}
              value={lesson.id}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              placeholder={`Lesson ${index + 1} id`}
              required
              disabled
            />
            {formik.errors.lessons && formik.errors.lessons[index] && formik.touched.lessons && formik.touched.lessons[index] ? (
              <div className="alert alert-danger">{formik.errors.lessons[index].id}</div>
            ) : null}
            <input
              type="text"
              id={`lessons.${index}.name`}
              name={`lessons.${index}.name`}
              value={lesson.name}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              placeholder={`Lesson ${index + 1} Name`}
              required
            />
            {formik.errors.lessons && formik.errors.lessons[index] && formik.touched.lessons && formik.touched.lessons[index] ? (
              <div className="alert alert-danger">{formik.errors.lessons[index].name}</div>
            ) : null}

            <textarea
              id={`lessons.${index}.content`}
              name={`lessons.${index}.content`}
                placeholder="Lesson Content"
                className="form-field textarea-field"
                onChange={formik.handleChange}
              onBlur={formik.handleBlur}
                value={lesson.content}
              />
            {formik.errors.lessons && formik.errors.lessons[index] && formik.touched.lessons && formik.touched.lessons[index] ? (
              <div className="alert alert-danger">{formik.errors.lessons[index].content}</div>
            ) : null}
              <input
              id={`lessons.${index}.lesson_num`}
              name={`lessons.${index}.lesson_num`}
                placeholder="Lesson Number"
                type="number"
                onChange={formik.handleChange}
              onBlur={formik.handleBlur}
                value={lesson.lesson_num}
              />
            {formik.errors.lessons && formik.errors.lessons[index] && formik.touched.lessons && formik.touched.lessons[index] ? (
              <div className="alert alert-danger">{formik.errors.lessons[index].lesson_num}</div>
            ) : null}
              <input
              id={`lessons.${index}.completed`}
              name={`lessons.${index}.completed`}
                type="checkbox"
                onChange={formik.handleChange}
              onBlur={formik.handleBlur}
                checked={lesson.completed}
              />

            <button
              type="button"
              className="remove-button"
              onClick={() => removeLesson(index)}
            >
              Remove Lesson
            </button>
          </div>
        ))}
        <button
          type="button"
          className="add-lesson-button"
          onClick={addLesson}
        >
          Add Lesson
        </button>
      </div>
        {isLoading ?  
        <button type='button' className='register-button'><i className='fas fa-spinner fa-spin'></i></button> :
        <button  className='btn btn-primary btn-lg btn-block' disabled={!formik.dirty && formik.isValid} type="submit" onSubmit={handlesectionSubmit} >update section</button>}
        <Toaster/>
      </form>
    </>
  }
}