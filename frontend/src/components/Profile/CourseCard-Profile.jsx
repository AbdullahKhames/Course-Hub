import React from "react";
import { Link } from "react-router-dom";
import { Card } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import config from "../config";

function CourseCardProfile({ course, owner }) {
  const navigate = useNavigate();

  function handleEdit(course) {
    navigate(`/instructor/updateCourse/${course.id}`, {
      state: { courseData: course },
    });
  }

  function handleCoursePage(course) {
    navigate(`/courses/${course.id}`, { state: { courseData: course } });
  }

  return (
    <Card className="my-3 p-3 rounded">
      <Card.Img
        src={course.image ? `${config.baseURL}/images/${course.image}` : "./courses/Default.jpg"}
        variant="top"
        className="card-img"
      />
      <Card.Body>
        <Card.Title as="div" className="card-head">
          <Link to={`/courses/${course.id}`} className="link-style">
            <strong style={{ fontSize: "30px" }}>{course.name}</strong>
          </Link>
          <div
            style={{
              paddingTop: "15px",
              color: "#373a3c",
              fontSize: "16px",
              fontWeight: "bold",
            }}
          >
            {course.approved ? (
              <p style={{ color: "#27ae60" }}>Approved</p>
            ) : (
              <p style={{ color: "#F92F60" }}>Not Approved</p>
            )}
          </div>
        </Card.Title>
        <Card.Text as="div" style={{ paddingBottom: "16px" }}>
          <p style={{ color: "#333" }}>{course.description.substring(0, 60)}{course.description.length > 60 && "..."}</p>
        </Card.Text>
        <Card.Text as="div" className="d-flex justify-content-between">
          <p style={{ color: "#0C356A", paddingTop: "8px" }}>
            Total Hours: {course.hours}
          </p>
          {course.approved ? (
            <div>
              {owner && (
                <button
                  className="btn btn-outline-success mr edit"
                  type="submit"
                  onClick={() => handleEdit(course)}
                >
                  Edit
                </button>
              )}
              <button
                className="btn btn-outline-success basic"
                type="submit"
                onClick={() => handleCoursePage(course)}
              >
                More Details
              </button>
            </div>
          ) : (
            <button
              className="btn btn-outline-success edit"
              type="submit"
              onClick={() => handleEdit(course)}
            >
              Edit
            </button>
          )}
        </Card.Text>
      </Card.Body>
    </Card>
  );
}

export default CourseCardProfile;
