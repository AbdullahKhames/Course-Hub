import React, { useState, useEffect } from "react";
import * as Yup from "yup";
import config from "../../config";
import { useLocation, useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import toast, { Toaster } from "react-hot-toast";
import "./addSection.css";
import api from "../../api";
import Loading from "../../Loading/loading";

export default function AddSection(props) {
  const [loading, setLoading] = useState(true);
  const [isLoading, setisLoading] = useState(false);
  const [errorMessage, seterrorMessage] = useState("");
  const nav = useNavigate();
  const location = useLocation();
  const { courseData } = location.state || {};

  useEffect(() => {
    if (courseData) {
      setLoading(false);
    }
  }, []);

  const SectionSchema = Yup.object().shape({
    name: Yup.string().required("Required"),
    section_num: Yup.number()
      .required("Required")
      .positive("Must be positive")
      .integer("Must be an integer"),
    completed: Yup.boolean(),
    lessons: Yup.array().of(
      Yup.object().shape({
        name: Yup.string().required("Required"),
        lesson_num: Yup.number()
          .required("Required")
          .positive("Must be positive")
          .integer("Must be an integer"),
        completed: Yup.boolean(),
        content: Yup.string().required(),
      })
    ),
  });

  // const handleCategoryChange = (event) => {
  //   const categoryId = event.target.value;
  //   formik.setFieldValue("category_id", categoryId);
  //   formik.setFieldTouched("category_id", true);
  // };

  async function handleSectionSubmit(values) {
    seterrorMessage("");
    try {
      setisLoading(true);
      let response = await api.post(
        `${config.api}/courses/${courseData.id}/sections`,
        values
      );
      if (response.status === 201) {
        setisLoading(false);
        toast.success("Section saved successfully!", {
          position: "top-center",
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
      if (error.response.status === 401) {
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        nav("/login");
        window.location.reload();
      }
      setisLoading(false);
      console.error(error);
      seterrorMessage(`${JSON.stringify(error.response.data)}`);
    }
    setisLoading(false);
  }

  const formik = useFormik({
    initialValues: {
      name: "",
      section_num: 1,
      completed: false,
      course_id: courseData.id,
      lessons: [
        {
          name: "",
          lesson_num: 1,
          completed: false,
          content: "",
        },
      ],
    },
    validationSchema: SectionSchema,
    onSubmit: handleSectionSubmit,
  });
  if (loading) {
    return <Loading />;
  } else {
    return (
      <>
        <div>
          <h1>Add a New Section</h1>
          {errorMessage.length > 0 ? (
            <div className="alert alert-danger">{errorMessage}</div>
          ) : null}

          <form onSubmit={formik.handleSubmit}>
            <div className="section">
              <h2>Section</h2>
              <input
                id={`name`}
                name={`name`}
                placeholder="Section Name"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.name}
              />
              {formik.errors.name &&
              formik.errors.name &&
              formik.touched.name ? (
                <div className="alert alert-danger">{formik.errors.name}</div>
              ) : null}
              <input
                id={`section_num`}
                name={`section_num`}
                placeholder="Section Number"
                type="number"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.section_num}
              />
              {formik.errors &&
              formik.errors?.section_num &&
              formik.touched?.section_num ? (
                <div className="alert alert-danger">
                  {formik.errors.section_num}
                </div>
              ) : null}
              <input
                section_num={`completed`}
                type="checkbox"
                id={`completed`}
                name={`completed`}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                checked={formik.completed}
              />
              <div className="lesson">
                {formik.values.lessons.length > 0 &&
                  formik.values.lessons.map((lesson, lessonIndex) => (
                    <div className="lesson" key={lessonIndex}>
                      <h3>Lesson {lessonIndex + 1}</h3>
                      <input
                        id={`lessons.${lessonIndex}.name`}
                        name={`lessons.${lessonIndex}.name`}
                        placeholder="Lesson Name"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={lesson.name}
                      />
                      {formik.errors &&
                      formik.errors.lessons &&
                      formik.errors.lessons[lessonIndex]?.name &&
                      formik.touched?.lessons?.[lessonIndex]?.name ? (
                        <div className="alert alert-danger">
                          {formik.errors.lessons[lessonIndex].name}
                        </div>
                      ) : null}
                      <textarea
                        id={`lessons.${lessonIndex}.content`}
                        name={`lessons.${lessonIndex}.content`}
                        placeholder="Lesson Content"
                        className="form-field textarea-field"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={lesson.content}
                      />
                      {formik.errors &&
                      formik.errors?.lessons &&
                      formik.errors.lessons[lessonIndex]?.content &&
                      formik.touched?.lessons?.[lessonIndex]?.content ? (
                        <div className="alert alert-danger">
                          {formik.errors.lessons[lessonIndex].content}
                        </div>
                      ) : null}
                      <input
                        id={`lessons.${lessonIndex}.lesson_num`}
                        name={`lessons.${lessonIndex}.lesson_num`}
                        placeholder="Lesson Number"
                        type="number"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={lesson.lesson_num}
                      />
                      {formik.errors &&
                      formik.errors?.lessons &&
                      formik.errors.lessons[lessonIndex]?.lesson_num &&
                      formik.touched?.lessons?.[lessonIndex]?.lesson_num ? (
                        <div className="alert alert-danger">
                          {formik.errors.lessons[lessonIndex].lesson_num}
                        </div>
                      ) : null}
                      <input
                        id={`lessons.${lessonIndex}.completed`}
                        name={`lessons.${lessonIndex}.completed`}
                        type="checkbox"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        checked={lesson.completed}
                      />
                      <button
                        className="remove-button"
                        type="button"
                        onClick={() => {
                          let newSections = { ...formik.values };
                          newSections.lessons.splice(lessonIndex, 1);
                          formik.setFieldValue("lessons", newSections.lessons);
                        }}
                      >
                        Remove Lesson
                      </button>
                    </div>
                  ))}
                <button
                  type="button"
                  className="add-lesson-button"
                  onClick={() => {
                    let newSections = { ...formik.values };
                    newSections.lessons.push({
                      name: "",
                      content: "",
                      lesson_num: "",
                      completed: false,
                    });
                    formik.setFieldValue("lessons", newSections.lessons);
                  }}
                >
                  Add Lesson
                </button>
              </div>
            </div>

            <p></p>

            {isLoading ? (
              <button type="button" className="register-button">
                <i className="fas fa-spinner fa-spin"></i>
              </button>
            ) : (
              <button
                className="btn btn-primary btn-lg btn-block"
                disabled={!formik.dirty && formik.isValid}
                type="submit"
                onSubmit={handleSectionSubmit}
              >
                create Section
              </button>
            )}
            <Toaster />
          </form>
        </div>
      </>
    );
  }
}
