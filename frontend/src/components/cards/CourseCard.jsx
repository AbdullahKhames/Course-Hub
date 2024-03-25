import React from "react";
import { Link } from "react-router-dom";
import { Card } from "react-bootstrap";
import api from "../api";
import config from "../config";
import toast from "react-hot-toast";
import { useContext } from "react";
import { UserDataContext } from "../UserContextProvider/UserContextProvider";
import { useNavigate } from "react-router-dom";
import "./CourseCard.css";

function CourseCard({ course, admin }) {
  const userContext = useContext(UserDataContext);
  const userData = userContext.userData;
  const navigate = useNavigate();

  function handleDelete(course) {
    if (userData && userData.role === 0) {
      api
        .delete(`${config.api}/courses/${course.id}`)
        .then((response) => {
          toast.success(response.data.message);
          window.location.reload();
        })
        .catch((error) => {
          console.error(error);
          toast.error("Error deleting course");
        });
    }
  }

  function handleApprove(course) {
    if (userData && userData.role === 0) {
      api
        .put(`${config.api}/courses/${course.id}/approve`, course.id)
        .then((response) => {
          toast.success(response.data.message);
          window.location.reload();
        })
        .catch((error) => {
          console.error(error);
          toast.error("Error approving course");
        });
    }
  }

  function handleCoursePage(course) {
    navigate(`/courses/${course.id}`, { state: { courseData: course } });
  }

  return (
    <Card className="my-3 p-3 rounded">
      <Link to={`/courses/${course.id}`}>
        <Card.Img
          src={course.image ? `${config.baseURL}/images/${course.image}` : "./courses/Default.jpg"}
          alt="Course"
          variant="top"
          className="card-img"
        />
      </Link>
      <Card.Body>
        <Card.Title as="div" className="card-head">
          <Link to={`/courses/${course.id}`} className="link-style">
            <strong style={{ fontSize: "30px" }}>{course.name}</strong>
          </Link>
          <Link to={`/users/${course.instructor_id}`} className="link-style">
            <p
              style={{ paddingTop: "15px", color: "#373a3c", fontSize: "14px" }}
            >
              by {course.instructor_name}
            </p>
          </Link>
        </Card.Title>
        <Card.Text as="div" style={{ paddingBottom: "16px" }}>
          <p style={{ color: "#333" }}>{course.description.substring(0, 60)}{course.description.length > 60 && "..."}</p>
        </Card.Text>
        <Card.Text as="div" className="d-flex justify-content-between">
          <p style={{ color: "#0C356A", paddingTop: "8px" }}>
            Total Hours: {course.hours}
          </p>
          <div>
            {admin && (
              <>
                <button
                  className="btn btn-outline-success mr mb delete"
                  type="submit"
                  onClick={() => handleDelete(course)}
                >
                  Delete
                </button>
                {!course.approved && (
                  <button
                    className="btn btn-outline-success mr mb approve"
                    type="submit"
                    onClick={() => handleApprove(course)}
                  >
                    Approve
                  </button>
                )}
              </>
            )}
            <button
              className="btn btn-outline-success mb basic"
              type="submit"
              onClick={() => handleCoursePage(course)}
            >
              More Details
            </button>
          </div>
        </Card.Text>
      </Card.Body>
    </Card>
  );
}

export default CourseCard;
