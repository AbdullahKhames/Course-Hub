import React, { useContext, useEffect, useState } from 'react';
import { UserDataContext } from '../../UserContextProvider/UserContextProvider';
import api from '../../api';
import config from '../../config';
import Loading from '../../Loading/loading';
import { useNavigate } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';

export default function ShowCourses() {
    const userContext = useContext(UserDataContext);
    const [loading, setLoading] = useState(true)
    const userData = userContext.userData;
    const [courses, setCourses] = useState([]);
    const navigate = useNavigate();
    useEffect(() =>{
        if (userData === null) {
            navigate('/login')
        }
        api.get(`${config.api}/instructors/${userData.id}/courses?page=1&per_page=100`)
        .then((response) => {
            if (response.status === 200) {
                setCourses(response.data);
                setLoading(false);
            }
        })
        .catch((err) => { 
            console.error(err);
        })
    }, [])
    function handleAdd(course) {
        if (userData && userData.id === course.instructor_id) {
            navigate(`/instructor/addSection`, { state: { courseData: course } });
        } else {
            toast.error("You are not allowed to edit this course !!", {
                duration: 4000
            })
        }
    
      }
    function handleUpdate(course) {
        if (userData && userData.id === course.instructor_id) {
            navigate(`/instructor/updateCourse/${course.id}`, { state: { courseData: course } });
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
            setCourses(resp.data.data);
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
            <th scope="col">approved</th>
            <th scope="col">hours</th>
            <th scope="col">category id</th>
            <th scope="col">add section</th>
            <th scope="col">update</th>
            <th scope="col">delete</th>
            </tr>
        </thead>
        <tbody>
        {courses.map((course, index) => (
            <tr key={course.id || index}>
                {/* <th scope="row">{course.id}</th> */}
                <td>{course.name}</td>
                <td>{course.description.split(' ').slice(0, 3).join(' ')}</td>
                <td>
                    <input type="checkbox" checked={course.approved} disabled />
                </td>
                <td>{course.hours}</td>
                <td>{course.category_id}</td>
                <td>
                    <button className='btn btn-secondary' onClick={() => handleAdd(course)}>add section</button>
                    <Toaster/>
                </td>
                <td>
                    <button className='btn btn-secondary' onClick={() => handleUpdate(course)}>Update</button>
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
