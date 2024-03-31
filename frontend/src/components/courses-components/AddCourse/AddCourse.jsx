import React, {useState, useEffect, useContext} from 'react'
import { UserDataContext } from '../../UserContextProvider/UserContextProvider';
import * as Yup from 'yup'
import config from '../../config';
import { useNavigate } from 'react-router-dom';
import { useFormik} from 'formik';
import toast, { Toaster } from 'react-hot-toast';
import './addCourse.css'
import api from '../../api';
import Loading from '../../Loading/loading';
export default function AddCourse(props) {
  const userContext = useContext(UserDataContext);
    const userData = userContext.userData; 
    const [loading, setLoading] = useState(true);
    const [categories, setcategories] = useState([])
    const [isLoading, setisLoading] = useState(false)
    const [errorMessage, seterrorMessage] = useState('')
    const nav = useNavigate();


    useEffect(() => {
      api.get(`${config.api}/categories?page=1&per_page=100`)
      .then((resp) => {
        setcategories(resp.data)
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
      })
    }, [])
    const CourseSchema = Yup.object().shape({
        name: Yup.string()
          .required('Required'),
        description: Yup.string(),
        approved : Yup.boolean(),
        hours: Yup.number()
          .required('Required')
          .positive('Must be positive')
          .integer('Must be an integer'),
        num_sections: Yup.number(),
        category_id: Yup.string().required("you must choose category id from givin list"),

        sections: Yup.array()
          .of(
            Yup.object().shape({
              name: Yup.string()
                .required('Required'),
              section_num: Yup.number()
                .required('Required')
                .positive('Must be positive')
                .integer('Must be an integer'),
              completed: Yup.boolean(),
              lessons: Yup.array()
                .of(
                  Yup.object().shape({
                    name: Yup.string()
                      .required('Required'),
                    lesson_num: Yup.number()
                      .required('Required')
                      .positive('Must be positive')
                      .integer('Must be an integer'),
                    completed: Yup.boolean(),
                    content: Yup.string().required()
                  })
                )
            })
          )
      });

      const handleCategoryChange = (event) => {
        const categoryId = event.target.value;
        formik.setFieldValue('category_id', categoryId);
        formik.setFieldTouched('category_id', true);
      };


      function convertImageToBase64(imageFile) {
        return new Promise((resolve, reject) => {
          if (!(imageFile instanceof Blob) && !(imageFile instanceof File)) {
            resolve(null);
            return;
          }
      
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result.split(',')[1]);
          reader.onerror = error => reject(error);
          reader.readAsDataURL(imageFile);
        });
      }

      async function handleCourseSubmit(values) {
        values.num_sections = values.sections.length;
      
        try {
          setisLoading(true);
      
          const imageFile = values.image;
          const imageBase64 = await convertImageToBase64(imageFile);
          if (imageBase64 !== null && imageBase64 !== undefined){
            values.imageBase64 = imageBase64;
          }
      
          let response = await api.post(`${config.api}/instructors/${userData.id}/courses`, values);
      
          if (response.status === 201) {
            setisLoading(false);
            toast.success('Course saved successfully!', {
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
          if (error.response && error.response.status === 401) {
            localStorage.removeItem('access_token');
            localStorage.removeItem('refresh_token');
            nav('/login');
            window.location.reload();
          }
      
          setisLoading(false);
          console.error(error);
          seterrorMessage(`${JSON.stringify(error.response?.data)}`);
        }
      }
    const formik = useFormik({
      initialValues : {
        name: '',
        description: '',
        approved: false,
        hours: '',
        num_sections: 1,
        category_id: undefined,
        instructor_id: userData.id,
        image: null, // Add the image field to initialValues
        sections: [
        {
            name: '',
            section_num: 1,
            completed: false,
            lessons: [
            {
                name: '',
                lesson_num: 1,
                completed: false,
                content: ''
            }
            ]
        }
        ]
      },
      validationSchema:CourseSchema,
      onSubmit: handleCourseSubmit
    });
    if (loading){
        return <Loading/>
    }
    else {
    return <>
        <div>

            {/* {errorMessage.length > 0 ?   
                <div className="alert alert-danger">
                {errorMessage}
            </div> :
            null
            } */}
            <h1>Add a New Course</h1>
            {errorMessage.length > 0 ?   
            <div className="alert alert-danger">
            {errorMessage}
            </div> : null}

            <form onSubmit={formik.handleSubmit}>
                <label htmlFor="name">Course Name:</label>
                <input
                type="text"
                name="name"
                id = "name"
                placeholder='course name'
                value={formik.values.name}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                required
                />
        {formik.errors.name && formik.touched.name ? <div className="alert alert-danger">{formik.errors.name}</div> : null}

                <label htmlFor="description">Description:</label>
                <input
                type="text"
                name="description"
                id = "description"
                placeholder='course description'
                value={formik.values.description}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                />
        {formik.errors.description && formik.touched.description ? <div className="alert alert-danger">{formik.errors.description}</div> : null}

                <label htmlFor="hours">Hours:</label>
                <input
                type="number"
                name="hours"
                id = "hours"
                placeholder='course hours'
                value={formik.values.hours}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                required
                />
                {formik.errors.hours && formik.touched.hours ? <div className="alert alert-danger">{formik.errors.hours}</div> : null}

                <label htmlFor="num_sections">Number of Sections:</label>
                <input
                type="number"
                name="num_sections"
                id="num_sections"
                placeholder="Number of Sections"
                value={formik.values.sections.length}
                required
                disabled
              />
                {formik.errors.num_sections && formik.touched.num_sections ? <div className="alert alert-danger">{formik.errors.num_sections}</div> : null}
                <label htmlFor="image">Image:</label>
              <input
                id="image"
                name="image"
                type="file"
                onChange={(event) => {
                  formik.setFieldValue('image', event.currentTarget.files[0]);
                }}
              />
              {/* Display error if there is any */}
              {formik.touched.image && formik.errors.image ? (
                <div>{formik.errors.image}</div>
              ) : null}
                {/* <label htmlFor="num_enrolled">Number Enrolled:</label>
                <Field id="num_enrolled" name="num_enrolled" placeholder="Number Enrolled" type="number" />
                <input
                type="number"
                name="hours"
                id = "hours"
                placeholder='course hours'
                value={formik.values.hours}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                required
                /> */}

                {/* <label htmlFor="category_id">Category ID:</label>
                <input
                type="text"
                name="category_id"
                id = "category_id"
                placeholder="Category ID"
                value={formik.values.category_id}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                />
                {formik.errors.category_id && formik.touched.category_id ? <div className="alert alert-danger">{formik.errors.category_id}</div> : null} */}

                  <div>
                    <label htmlFor="category_id">Category:</label>
                    <select
                      id="category_id"
                      name="category_id"
                      value={formik.values.category_id}
                      onChange={handleCategoryChange}
                      onBlur={formik.handleBlur}
                    >
                      <option value="" label="Select a category" />
                      {categories.map((category) => (
                        <option key={category.id} value={category.id}>
                          {category.name}
                        </option>
                      ))}
                    </select>
                    {formik.errors.category_id && formik.touched.category_id ? (
                      <div className="alert alert-danger">{formik.errors.category_id}</div>
                    ) : null}
                  </div>
                {/* <label htmlFor="instructor_id">Instructor ID:</label>
                <Field id="instructor_id" name="instructor_id" placeholder="Instructor ID" />
                {formik.errors.instructor_id && formik.touched.instructor_id ? <div className="alert alert-danger">{formik.errors.instructor_id}</div> : null}

                */}


    {formik.values.sections.length > 0 &&
      formik.values.sections.map((section, index) => (
        <div className="section" key={index}>
          <h2>Section {index + 1}</h2>
          <input
            id = {`sections.${index}.name`}
            name={`sections.${index}.name`}
            placeholder="Section Name"
            onChange={formik.handleChange}
                onBlur={formik.handleBlur}
            value={section.name}
          />
        {formik.errors.sections && formik.errors.sections[index]?.name && formik.touched.sections?.[index]?.name ? (
        <div className="alert alert-danger">{formik.errors.sections[index].name}</div>
        ) : null}
          <input
          id = {`sections.${index}.section_num`}
            name={`sections.${index}.section_num`}
            placeholder="Section Number"
            type="number"
            onChange={formik.handleChange}
                onBlur={formik.handleBlur}
            value={section.section_num}
          />
        {formik.errors.sections && formik.errors.sections?.[index]?.section_num && formik.touched.sections?.[index]?.section_num ? (
            <div className="alert alert-danger">{formik.errors.sections[index].name}</div>
            ) : null}
          <input
            section_num={`sections.${index}.completed`}
            type="checkbox"
            id = {`sections.${index}.completed`}
            name={`sections.${index}.completed`}
            onChange={formik.handleChange}
                onBlur={formik.handleBlur}
            checked={section.completed}
          />
          <div className='lesson'>
            {section.lessons.length > 0 &&
            section.lessons.map((lesson, lessonIndex) => (
              <div className="lesson" key={lessonIndex}>
                <h3>Lesson {lessonIndex + 1}</h3>
                <input
                id = {`sections.${index}.lessons.${lessonIndex}.name`}
                  name={`sections.${index}.lessons.${lessonIndex}.name`}
                  placeholder="Lesson Name"
                  onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                  value={lesson.name}
                />
                {formik.errors.sections && formik.errors.sections[index]?.lessons && formik.errors.sections[index].lessons[lessonIndex]?.name &&
                formik.touched.sections?.[index]?.lessons?.[lessonIndex]?.name ? (
                <div className="alert alert-danger">{formik.errors.sections[index].lessons[lessonIndex].name}</div>
                ) : null}
                <textarea
                id = {`sections.${index}.lessons.${lessonIndex}.content`}
                  name={`sections.${index}.lessons.${lessonIndex}.content`}
                  placeholder="Lesson Content"
                  className="form-field textarea-field"
                  onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                  value={lesson.content}
                />
                {formik.errors.sections && formik.errors.sections[index]?.lessons && formik.errors.sections[index].lessons[lessonIndex]?.content &&
                formik.touched.sections?.[index]?.lessons?.[lessonIndex]?.content ? (
                <div className="alert alert-danger">{formik.errors.sections[index].lessons[lessonIndex].content}</div>
                ) : null}
                <input
                id = {`sections.${index}.lessons.${lessonIndex}.lesson_num`}
                  name={`sections.${index}.lessons.${lessonIndex}.lesson_num`}
                  placeholder="Lesson Number"
                  type="number"
                  onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                  value={lesson.lesson_num}
                />
                {formik.errors.sections &&
                formik.errors.sections[index]?.lessons &&
                formik.errors.sections[index].lessons[lessonIndex]?.lesson_num &&
                formik.touched.sections?.[index]?.lessons?.[lessonIndex]?.lesson_num ? (
                <div className="alert alert-danger">{formik.errors.sections[index].lessons[lessonIndex].lesson_num}</div>
                ) : null}
                <input
                id = {`sections.${index}.lessons.${lessonIndex}.completed`}
                  name={`sections.${index}.lessons.${lessonIndex}.completed`}
                  type="checkbox"
                  onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                  checked={lesson.completed}
                />
                <button
                  className='remove-button'
                  type="button"
                  onClick={() => {
                    let newSections = [...formik.values.sections];
                    newSections[index].lessons.splice(lessonIndex, 1);
                    formik.setFieldValue('sections', newSections);
                  }}
                >
                  Remove Lesson
                </button>
              </div>
            ))}
            <button
              type="button"
              className='add-lesson-button'
              onClick={() => {
                let newSections = [...formik.values.sections];
                newSections[index].lessons.push({ name: '', content: '', lesson_num: '', completed: false });
                formik.setFieldValue('sections', newSections);
              }}
            >
              Add Lesson
            </button>
          </div>
          <button
            className='remove-button'
            type="button"
            onClick={() => {
              let newSections = [...formik.values.sections];
              newSections.splice(index, 1);
              formik.setFieldValue('sections', newSections);
            }}
          >
            Remove Section
          </button>
        </div>
      ))}
    <button
    type="button"
    className='add-section-button'
    onClick={() => {
        let newSections = [...formik.values.sections];
        newSections.push({ name: '', section_num: '', completed: false, lessons: [] });
        formik.setFieldValue('sections', newSections);
    }}
    >
    Add Section
    </button>
    <p></p>

        {isLoading ?  
        <button type='button' className='register-button'><i className='fas fa-spinner fa-spin'></i></button> :
        <button  className='btn btn-primary btn-lg btn-block' disabled={!formik.dirty && formik.isValid} type="submit" onSubmit={handleCourseSubmit} >create Course</button>}
        <Toaster/>
        </form>
    </div>
     </>
    }
}
