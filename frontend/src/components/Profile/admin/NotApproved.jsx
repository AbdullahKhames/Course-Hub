import React from "react";
import { useEffect, useState } from "react";
import "../userProfile.css";
import api from "../../api";
import config from "../../config";
import Loading from "../../Loading/loading";
import toast from "react-hot-toast";
import CourseCard from "../../cards/CourseCard";
import {
    MDBCol,
    MDBCardTitle,
    MDBRow,
  } from "mdb-react-ui-kit";



function NotApprovedCourses() {
  const [notApprovedCourses, setNotApprovedCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  function getNotApprovedCourses() {
    api
      .get(`${config.api}/courses/not-approved?page=1&per_page=4`)
      .then((response) => {
        setNotApprovedCourses(response.data.data);
        toast.success(response.data.message);
        setLoading(false);
      })
      .catch((error) => {
        console.error(error);
      });
  }

  useEffect(() => {
    getNotApprovedCourses();
  }, []);

  if (loading) {
    return <Loading />;
  } else {
    return (
        <MDBRow>
        <MDBCardTitle className="SubHeading">
            Not Approved Courses
        </MDBCardTitle>
        <MDBRow className="py-4">
          {notApprovedCourses.length === 0 ? (
            <strong>All Courses have been Approved</strong>
          ) : (
            notApprovedCourses.map((course, index) => (
              <MDBCol lg="5" key={course.id || index}>
                <CourseCard course={course} admin={true} />
              </MDBCol>
            ))
          )}
        </MDBRow>
      </MDBRow>
    );
  }

}

export default NotApprovedCourses;
