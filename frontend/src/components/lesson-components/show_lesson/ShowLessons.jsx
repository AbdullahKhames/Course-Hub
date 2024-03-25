import React, { useEffect, useState } from 'react';
import api from '../../api';
import config from '../../config';
import Loading from '../../Loading/loading';
import { useNavigate } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';

export default function ShowLessons() {
    const [loading, setLoading] = useState(true)
    const [lessons, setlessons] = useState([]);
    const navigate = useNavigate();
    useEffect(() =>{
        api.get(`${config.api}/instructor/lessons`)
        .then((response) => {
            if (response.status === 200) {
                setlessons(response.data.data);
                toast.success(response.data.message)
                setLoading(false);
            }
        })
        .catch((err) => { 
            console.error(err);
        })
    }, [])
    function handleUpdate(lesson) {
        navigate(`/instructor/updateLesson/${lesson.id}`, { state: { lessonData: lesson } });
      }
      function handleDelete(id) {
        api.delete(`${config.api}/lessons/${id}`)
        .then((resp) => {
            toast.success("deleted successfully");
            setlessons(prevLessons => prevLessons.filter(lesson => lesson.id !== id));
        })
        .catch((err) => {
            console.error(err);
            toast.error("cant delete this lesson")
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
            <th scope="col">id</th>
            <th scope="col">name</th>
            <th scope="col">section id</th>
            <th scope="col">update</th>
            <th scope="col">delete</th>
            </tr>
        </thead>
        <tbody>
        {lessons.map((lesson, index) => (
            <tr key={lesson.id || index}>
                <th scope="row">{lesson.id}</th>
                <td>{lesson.name}</td>
                <td>{lesson.section_id}</td>

                <td>
                    <button className='btn btn-secondary' onClick={() => handleUpdate(lesson)}>Update</button>
                    <Toaster/>
                </td>
                <td>
                    <button className='btn btn-danger' onClick={() => handleDelete(lesson.id)}>Delete</button>
                </td>
            </tr>
    
        ))}
        </tbody>
        </table>
      </>
      }

}
