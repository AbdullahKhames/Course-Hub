import config from "../config";
import "./userProfile.css";
import CourseCardProfile from "./CourseCard-Profile";
import CourseCard from "../cards/CourseCard";
import NotApprovedCourses from "./admin/NotApproved";

import {
  MDBCol,
  MDBCardTitle,
  MDBContainer,
  MDBRow,
  MDBCard,
  MDBCardText,
  MDBCardBody,
  MDBCardImage,
} from "mdb-react-ui-kit";
import Search from "../search/search";

function UserProfile({ data, owner }) {
  let courses = [];
  if (data.role > 0) {
    courses = data.courses;
    if (owner === false) {
      courses = courses.filter((course) => course.approved === true);
    }
  }
  return (
    <>
    <Search />
    <section style={{ backgroundColor: "#eee" }}>
      <MDBContainer className="py-5">
        <MDBRow>
          <MDBCol lg="4">
            <MDBCard className="mb-4">
              <MDBCardBody className="text-center">
                <MDBCardImage
                  src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-chat/ava3.webp" //image to add
                  alt="avatar"
                  className="rounded-circle"
                  style={{ width: "150px" }}
                  fluid
                />
              </MDBCardBody>
            </MDBCard>
          </MDBCol>
          <MDBCol lg="8">
            <MDBCard className="mb-4">
              <MDBCardBody>
                <MDBRow>
                  <MDBCol sm="3">
                    <MDBCardText>Full Name</MDBCardText>
                  </MDBCol>
                  <MDBCol sm="9">
                    <MDBCardText className="text-muted">
                      {data.name}
                    </MDBCardText>
                  </MDBCol>
                </MDBRow>
                <hr />
                <MDBRow>
                  <MDBCol sm="3">
                    <MDBCardText>Email</MDBCardText>
                  </MDBCol>
                  <MDBCol sm="9">
                    <MDBCardText className="text-muted">
                      {data.email}
                    </MDBCardText>
                  </MDBCol>
                </MDBRow>
                <hr />
                <MDBRow>
                  <MDBCol sm="3">
                    <MDBCardText>Role</MDBCardText>
                  </MDBCol>
                  <MDBCol sm="9">
                    <MDBCardText className="text-muted">
                      {config.roles[data.role]}
                    </MDBCardText>
                  </MDBCol>
                </MDBRow>
                {data.role > 0 && (data.role === 1 ? (
                  <>
                    <hr />
                    <MDBRow>
                      <MDBCol sm="3">
                        <MDBCardText>Total Courses</MDBCardText>
                      </MDBCol>
                      <MDBCol sm="9">
                        <MDBCardText className="text-muted">
                          {data.courses.length}
                        </MDBCardText>
                      </MDBCol>
                    </MDBRow>
                    <hr />
                    <MDBRow>
                      <MDBCol sm="3">
                        <MDBCardText>Total Students</MDBCardText>
                      </MDBCol>
                      <MDBCol sm="9">
                        <MDBCardText className="text-muted">
                          {data.total_students}
                        </MDBCardText>
                      </MDBCol>
                    </MDBRow>
                  </>
                ) : (
                  <>
                    <hr />
                    <MDBRow>
                      <MDBCol sm="3">
                        <MDBCardText>Interested In</MDBCardText>
                      </MDBCol>
                      <MDBCol sm="9">
                        <MDBCardText className="text-muted">
                          {data.interested.name}
                        </MDBCardText>
                      </MDBCol>
                    </MDBRow>
                    <hr />
                    <MDBRow>
                      <MDBCol sm="3">
                        <MDBCardText>My Courses</MDBCardText>
                      </MDBCol>
                      <MDBCol sm="9">
                        <MDBCardText className="text-muted">
                          {data.courses.length}
                        </MDBCardText>
                      </MDBCol>
                    </MDBRow>
                  </>
                ))}
              </MDBCardBody>
            </MDBCard>
          </MDBCol>
        </MDBRow>

        <br />
        <br />
        {data.role === 0 ? (
          owner && (
            <NotApprovedCourses />
          )
        ) : (
          <MDBRow>
            <MDBCardTitle className="SubHeading">
              {data.role === 1 ? "My Courses" : "My Learning"}
            </MDBCardTitle>
            <MDBRow className="py-4">
              {courses.length === 0 ? (
                <strong>No Data!</strong>
              ) : (
                courses.map((course, index) => (
                  <MDBCol lg="4" key={course.id || index}>
                    {data.role === 1 ? (
                    <CourseCardProfile course={course} owner={owner} />
                    ) : (
                      <CourseCard course={course} admin={false} />
                    )}
                  </MDBCol>
                ))
              )}
            </MDBRow>
          </MDBRow>
        )}
      </MDBContainer>
    </section>
    </>
  );
}

export default UserProfile;
