import React, {useState, useEffect, useContext} from 'react'
import { UserDataContext } from '../../UserContextProvider/UserContextProvider';
import api from '../../api';
import toast from 'react-hot-toast';
import config from '../../config';
import Loading from '../../Loading/loading';
import { useNavigate } from 'react-router-dom';

export default function SearchCourse() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('id');
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isLoading, setisLoading] = useState(false)

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
      api.get(`${config.api}/courses/${filterType}/${searchTerm}`)
        .then(response => {
          setCourses(response.data.data);
          setisLoading(false)
        })
        .catch(error => {
          console.error('Error fetching data: ', error);
          setisLoading(false)
        });
    }
    setisLoading(false)
  };


  function handleUpdateClick(course) {
    if (userData && userData.id === course.instructor_id) {
        setCourses([]);
        setSearchTerm('');
        navigate(`/instructor/updateCourse/${course.id}`, { state: { courseData: course } });
    } else {
        toast.error("You are not allowed to edit this course !!", {
            duration: 4000
        })
    }

  }
  function handleDeleteClick(id) {
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
                {courses.map((course, index) => (
                  <div key={course.id || index} className="col-md-10 mb-4">
                    <div className="card">
                      <div className="card-body">
                        <h5 className="card-title">{course.name}</h5>
                        <p className="card-text">Description: {course.description}</p>
                        <p className="card-text">Hours: {course.hours}</p>
                        <p className="card-text">Sections: {course.num_sections}</p>
                        <p className="card-text">ID: {course.id}</p>
                        <p className="card-text">Instructor ID: {course.instructor_id}</p>

                        <div className="d-flex justify-content-between">
                          <button
                            className="btn btn-primary"
                            onClick={(e) => {
                              e.stopPropagation(); // Prevent card click when the button is clicked
                              handleUpdateClick(course);
                            }}
                          >
                            Update
                          </button>
                          <button
                            className="btn btn-danger"
                            onClick={(e) => {
                              e.stopPropagation(); // Prevent card click when the button is clicked
                              handleDeleteClick(course.id);
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
