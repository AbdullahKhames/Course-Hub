import React from "react";
import { Container, Row, Col, Card } from "react-bootstrap";
import { useParams, useNavigate, useLocation, Link } from "react-router-dom";
import api from "../../api";
import config from "../../config";
import toast from "react-hot-toast";
import { useContext, useEffect, useState } from "react";
import { UserDataContext } from "../../UserContextProvider/UserContextProvider";
import "./CoursePage.css";
import Loading from "../../Loading/loading";
import NotFound from "../../not-found/NotFound";
import NotApproved from "../../not_approved/not_approved";
import EnrollCard from "./EnrollCard";
import CourseContent from "./Content";
import Search from "../../search/search";

function CoursePage() {
  const userContext = useContext(UserDataContext);
  const userData = userContext.userData;
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [course, setCourse] = useState(null);

  const getCourse = (url_api) => {
    api
      .get(`${url_api}`)
      .then((res) => {
        if (res.status === 200) {
          setCourse(res.data.data);
          toast.success(res.data.message);
          setLoading(false);
        }
      })
      .catch((err) => {
        console.error(err);
        navigate("/not-found");
      });
  };

  const { id } = useParams();
  const url_api = config.api + "/courses/" + id;
  const location = useLocation();

  useEffect(() => {
    if (location.state) {
      setCourse(location.state.courseData);
      if (location.state.courseData === null) {
        setLoading(true);
        getCourse(url_api);
      }
      setLoading(false);
    } else {
      setLoading(true);
      getCourse(url_api);
    }
  }, [location.state]);

  if (loading) {
    return <Loading />;
  }
  if (course === null) {
    return <NotFound />;
  } else if (course.approved === false && (!userData || userData.role !== 0)) {
    return <NotApproved />;
  } else {
    return (
      <>
        <Search />
        <section className="course-page" style={{ backgroundColor: "#eee" }}>
          <Container>
            <Row>
              <Col md={8}>
                <Card>
                  <Card.Header as="div" className="course-title">
                    {course.name}
                  </Card.Header>
                  <Card.Body>
                    <Card.Text className="course-description">
                      {course.description}
                    </Card.Text>
                    <Card.Text className="course-details">
                      <ul>
                        {course.category_id && (
                          <li>
                            Category{" "}
                            <Link to={`/categories/${course.category_id}`}>
                              <span className="redirect">
                                {course.category_name}
                              </span>
                            </Link>
                          </li>
                        )}
                        <li>Total Hours {course.hours}</li>
                        <li>Total Students {course.num_enrolled}</li>
                        <li>
                          Created By{" "}
                          <Link to={`/users/${course.instructor_id}`}>
                            <span className="redirect">
                              {course.instructor_name}
                            </span>
                          </Link>
                        </li>
                      </ul>
                    </Card.Text>
                    <Card.Text className="footer-text">
                      <div className="icon-block" style={{ width: "220px" }}>
                        <div className="last-updated-icon"></div>
                        <span className="icon-text">
                          Last updated{" "}
                          {course.updated_at
                            .substring(0, 10)
                            .replace(/-/g, "/")
                            .split("/")
                            .reverse()
                            .join("/")}
                        </span>
                      </div>
                      <div className="icon-block">
                        <div className="Language-icon"></div>
                        <span className="icon-text">English</span>
                      </div>
                      <div className="icon-block" style={{ width: "160px" }}>
                        <div className="infinity-icon"></div>
                        <span className="icon-text">Full lifetime access</span>
                      </div>
                    </Card.Text>
                  </Card.Body>
                </Card>

                {/* Additional content, such as course modules, lectures, etc., can be added here 
              <svg aria-hidden="false" aria-label="Course Language" role="img" focusable="false" class="ud-icon ud-icon-xsmall ud-icon-color-neutral icon"><use xlink:href="#icon-language"></use></svg>*/}
              </Col>

              <Col md={4}>
                <Card className="course-image">
                  <Card.Body>
                    {/* <Card.Text>Instructor details and bio go here.</Card.Text> */}
                    <Card.Img
                      variant="top"
                      // src={course.image_url}
                      src={
                        course.image
                          ? `${config.baseURL}/images/${course.image}`
                          : "./courses/Default.jpg"
                      }
                      style={{ width: "100%" }}
                    />
                  </Card.Body>
                </Card>
                <EnrollCard user={userData} course={course} />
              </Col>
            </Row>
            <br />
            <Row>
              <Col>
                <CourseContent user={userData} course={course} />
              </Col>
            </Row>
          </Container>
        </section>
      </>
    );
  }
}

export default CoursePage;
