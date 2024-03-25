import React, { useEffect, useState } from 'react';
import api from '../../api';
import config from '../../config';
import Loading from '../../Loading/loading';
import { useNavigate } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';

export default function ShowSections() {
    const [loading, setLoading] = useState(true)
    const [sections, setsections] = useState([]);
    const navigate = useNavigate();
    useEffect(() =>{
        api.get(`${config.api}/instructor/sections`)
        .then((response) => {
            if (response.status === 200) {
                setsections(response.data.data);
                toast.success(response.data.message)
                setLoading(false);
            }
        })
        .catch((err) => { 
            console.error(err);
        })
    }, [])
    function handleAdd(section) {
      navigate(`/instructor/addLesson`, { state: { sectionData: section } });
    }
    function handleUpdate(section) {
        navigate(`/instructor/updateSection/${section.id}`, { state: { sectionData: section } });
      }
      function handleDelete(id) {
        api.delete(`${config.api}/sections/${id}`)
        .then((resp) => {
            toast.success("deleted successfully");
            setsections(prevsections => prevsections.filter(section => section.id !== id));
        })
        .catch((err) => {
            console.error(err);
            toast.error("cant delete this section")
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
            <th scope="col">course id</th>
            <th scope="col">add lesson</th>
            <th scope="col">update</th>
            <th scope="col">delete</th>
            </tr>
        </thead>
        <tbody>
        {sections.map((section, index) => (
            <tr key={section.id || index}>
                <th scope="row">{section.id}</th>
                <td>{section.name}</td>
                <td>{section.course_id}</td>

                <td>
                    <button className='btn btn-secondary' onClick={() => handleAdd(section)}>Add lesson</button>
                </td>
                <td>
                    <button className='btn btn-secondary' onClick={() => handleUpdate(section)}>Update</button>
                    <Toaster/>
                </td>
                <td>
                    <button className='btn btn-danger' onClick={() => handleDelete(section.id)}>Delete</button>
                </td>
            </tr>
    
        ))}
        </tbody>
        </table>
      </>
      }

}
