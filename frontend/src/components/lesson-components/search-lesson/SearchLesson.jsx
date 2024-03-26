import React, {useState, useEffect, useContext} from 'react'
import { UserDataContext } from '../../UserContextProvider/UserContextProvider';
import api from '../../api';
import toast, { Toaster } from 'react-hot-toast';
import config from '../../config';
import Loading from '../../Loading/loading';
import { useNavigate } from 'react-router-dom';


export default function SearchLesson() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('id');
  const [lessons, setlessons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isLoading, setisLoading] = useState(false);

  const userContext = useContext(UserDataContext);
  let userData = userContext.userData;

  const navigate = useNavigate();
  useEffect(() => {
    if (userData) {
      setLoading(false);
    }
  }, [userData]);

  const handleSearch = () => {
    setisLoading(true);
    if (searchTerm !== '') {
      api.get(`${config.api}/lessons/${filterType}/${searchTerm}`)
        .then(response => {
          setlessons(response.data.data);
          setisLoading(false)
        })
        .catch(error => {
          console.error('Error fetching data: ', error);
          setisLoading(false)
        });
    }
    setisLoading(false)
  };


  function handleUpdate(category) {
    navigate(`/admin/updateCategory/${category.id}`, { state: { categoryData: category } });  
    }
    function handleDelete(id) {
      api.delete(`${config.api}/lessons/${id}?page=1&per_page=0`)
      .then((resp) => {
          toast.success("deleted successfully");
          setlessons(resp.data)
      })
      .catch((err) => {
          console.error(err);
          toast.error("cant delete this category")
      })
    }

  
    if (loading){
      return <Loading />
    } else {
      return <>
       <div>
            <input
              type="text"
              placeholder="Search..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
            <select value={filterType} onChange={e => setFilterType(e.target.value)}>
              <option value="name">Name</option>
              <option value="id">ID</option>
            </select>
            {isLoading? <button type='button' className='fas fa-spinner fa-spin'></button>: 
            <button className="btn btn-primary btn-block" onClick={handleSearch}>Search</button>}
            <div className="row">
                {lessons.map((category, index) => (
                  <div key={category.id || index} className="col-md-10 mb-4">
                    <div className="card">
                      <div className="card-body">
                        <h5 className="card-title">{category.name}</h5>


                        <div className="d-flex justify-content-between">
                          <button
                            className="btn btn-primary"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleUpdate(category);
                            }}
                          >
                            Update
                          </button>
                          <Toaster/>
                          <button
                            className="btn btn-danger"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDelete(category.id);
                            }}
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        }
}
