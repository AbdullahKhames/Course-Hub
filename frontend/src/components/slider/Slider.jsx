import Carousel from 'react-bootstrap/Carousel';
import api from '../api';
import config from '../config';
import { useEffect, useState } from 'react';
import Loading from '../Loading/loading';
import { Link } from 'react-router-dom';
import "./Slider.css";

function Slider() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  const url_api = config.api + '/courses/best?page=1&per_page=3';

  useEffect(() => {
    api
      .get(url_api)
      .then((response) => {
        if (response.status === 200) {
          setCourses(response.data);
          setLoading(false);
        }
      })
      .catch((error) => {
        console.error(error);
        setLoading(true);
      });
  }
  , []);

  return (
    <Carousel>
      {console.log(courses)}
      {loading ? (
        <Loading />
      ) : (
        courses.map((course, index) => (
          <Carousel.Item key={course.id || index} className='slide'>
            <img
              className="d-block w-100 slider-img"
              src={course.image ? `${config.baseURL}/images/${course.image}` : "./courses/Default.jpg"}
              alt={course.name}
              onClick={() => window.location.href = '/courses/' + course.id}
            />

            <Carousel.Caption className='slide-text'>
              <div>
              <Link to={'/courses/' + course.id}>
                <h3 className='slide-link'>{course.name}</h3>
              </Link>
              <p>{course.description.substring(0, 60)}{course.description.length > 60 && "..."}</p>
              </div>
            </Carousel.Caption>
          </Carousel.Item>
        ))
      )}

    </Carousel>
  );
}

export default Slider;
