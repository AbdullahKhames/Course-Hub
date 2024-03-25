import React from 'react'
import CourseList from './CourseList'
function Courses() {
  return <>
            {/* Search bar in the middle */}
  <form className="d-flex mx-auto">
    <input
      className="form-control me-2 custom-search-input"
      type="search"
      placeholder="Search"
      aria-label="Search"
    />
    <button className="btn btn-outline-success basic" type="submit">
      Search
    </button>
  </form>
  <div className="row">
    {/* <Container> */}
      <CourseList />
    {/* </Container> */}
    
  </div>
  </>
    
  
}

export default Courses