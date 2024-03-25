import React, { useContext, useEffect, useState } from 'react'
import { UserDataContext } from '../../UserContextProvider/UserContextProvider';
import { useNavigate } from 'react-router-dom';
import api from '../../api';
import config from '../../config';
import Loading from '../../Loading/loading';
import toast, { Toaster } from 'react-hot-toast';


export default function ShowCategories() {
  const [loading, setLoading] = useState(true)
  const userContext = useContext(UserDataContext);
  const userData = userContext.userData;
  const [categories, setcategories] = useState([]);
  const navigate = useNavigate();
  useEffect(() =>{
      if (userData === null) {
          navigate('/login')
      }
      api.get(`${config.api}/categories?page=1&per_page=100`)
      .then((response) => {
          if (response.status === 200) {
              setcategories(response.data);
              setLoading(false);
              toast.success("all categories retrived");
          }
      })
      .catch((err) => { 
          console.error(err);
          toast.error("error loading categories");
      })
  }, [])
  function handleUpdate(category) {
    navigate(`/admin/updateCategory/${category.id}`, { state: { categoryData: category } });  
    }

    function handleDelete(id) {
      api.delete(`${config.api}/categories/${id}?page=1&per_page=100`)
      .then((resp) => {
          toast.success("deleted successfully");
          setcategories(prevCategories => prevCategories.filter(c => c.id !== id));
      })
      .catch((err) => {
          console.error(err);
          toast.error("cant delete this course")
      })
    }

    if (loading) {
      return <Loading/>
    }
    else {
      return <>
      <table className="table">
      <thead className='table-dark'>
          <tr>
          {/* <th scope="col">id</th> */}
          <th scope="col">id</th>
          <th scope="col">name</th>
          <th scope="col">update</th>
          <th scope="col">deelete</th>
          </tr>
      </thead>
      <tbody>
      {categories.map((category, index) => (
          <tr key={category.id || index}>
              <th scope="row">{category.id}</th>
              <td>{category.name}</td>
              <td>
                  <button className='btn btn-secondary' onClick={() => handleUpdate(category)}>Update</button>
                  <Toaster/>
              </td>
              <td>
                  <button className='btn btn-danger' onClick={() => handleDelete(category.id)}>Delete</button>
              </td>
          </tr>
  
      ))}
      </tbody>
      </table>
    </>
    }
}
