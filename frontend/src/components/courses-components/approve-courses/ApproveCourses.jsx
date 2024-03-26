import React, { useContext, useEffect, useState } from 'react'
import api from '../../api'
import config from '../../config'
import toast, { Toaster } from 'react-hot-toast'
import Loading from '../../Loading/loading'
import { useNavigate } from 'react-router'
import { UserDataContext } from '../../UserContextProvider/UserContextProvider'

export default function ApproveCourses() {
  const [notApprovedCourses, setnotApprovedCourses] = useState([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate();
  const userContext = useContext(UserDataContext);
  const userData = userContext.userData;
  function getNotApprovedCourses() {
    api.get(`${config.api}/courses/not-approved?page=1&per_page=100`)
    .then((response) => {
      setnotApprovedCourses(response.data.data);
      toast.success(response.data.message);
      setLoading(false);
    })
    .catch((error) => {
      console.error(error);
    })
  }

  useEffect(() => {
    getNotApprovedCourses();
  }, [])



  function handleViewDetails(course) {
    navigate(`/courses/${course.id}`, { state: { courseData: course } });
  }

  function handleApprove(course) {
    if (userData && userData.role === 0) {
        api.put(`${config.api}/courses/${course.id}/approve`, course.id)
        .then(resp => {
          toast.success(resp.data.message);
          setnotApprovedCourses(prevCourses => prevCourses.filter(c => c.id !== course.id));

        })
        .catch(err => {
          toast.error(err)
        })
    } else {
        toast.error("You are not allowed to edit this course !!", {
            duration: 4000
        })
    }

  }

  function handleDelete(id) {
    api.delete(`${config.api}/courses/${id}?page=1&per_page=100`)
    .then((resp) => {
        toast.success("deleted successfully");
    })
    .catch((err) => {
        console.error(err);
        toast.error("cant delete this course")
    })
  }


  if (loading) {
    return <>
        <Loading/>
    </>
  }
  else {
    return <>
            <table className="table">
    <thead className='table-dark'>
        <tr>
        {/* <th scope="col">id</th> */}
        <th scope="col">name</th>
        <th scope="col">description</th>
        <th scope="col">Course Details</th>
        <th scope="col">approve </th>
        <th scope="col">delete</th>
        </tr>
    </thead>
    <tbody>
    {notApprovedCourses.map((course, index) => (
        <tr key={course.id || index}>
            {/* <th scope="row">{course.id}</th> */}
            <td>{course.name}</td>
            <td>{course.description.split(' ').slice(0, 3).join(' ')}</td>

            <td>
                <button className='btn btn-secondary' onClick={() => handleViewDetails(course)}>Course Details</button>
            </td>
            <td>
                <button className='btn btn-secondary' onClick={() => handleApprove(course)}>Approve Course</button>
                <Toaster/>
            </td>
            <td>
                <button className='btn btn-danger' onClick={() => handleDelete(course.id)}>Delete</button>
            </td>
        </tr>

    ))}
    </tbody>
    </table>
  </>
  }
}
