import React from "react";
import Search from "../search/search";
import CourseList from "./CourseList";
function Courses() {
  return (
    <>
      <Search />

      <div className="row">
        {/* <Container> */}
        <CourseList />
        {/* </Container> */}
      </div>
    </>
  );
}

export default Courses;
