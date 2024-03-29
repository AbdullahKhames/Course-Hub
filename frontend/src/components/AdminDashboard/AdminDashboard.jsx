import React, { useContext, useEffect, useState } from 'react';
import { Outlet , Link} from 'react-router-dom';
import './AdminDashboard.css';
import Header from '../header/Header';
import Footer from '../footer/Footer';
import Loading from '../Loading/loading';
import { UserDataContext } from '../UserContextProvider/UserContextProvider';

export default function AdminDashboard(props) {
  const userContext = useContext(UserDataContext);
  const userData = userContext.userData;
  const [loading, setLoading] = useState(true);
  const [optionsVisibility, setOptionsVisibility] = useState({
    courses: false,
    sections: false,
    lessons: false,
    categories: false,
    create_admin: false
  });

  const toggleOptions = (sectionId) => {
    setOptionsVisibility((prevVisibility) => ({
      ...prevVisibility,
      [sectionId]: !prevVisibility[sectionId],
    }));
  };

  useEffect(() => {
    if (userContext.userData && userContext.userData.role !== null && userContext.userData.role !== undefined) {
      setLoading(false);
    }
  }, [userContext.userData]);

  if (loading) {
    return <Loading />;
  } else {
    return (
      <>
      <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <Header  userData={userContext.userData} saveUserData={userContext.saveUserData}/>
        <div style={{ flex: 1 }}>
        <div className="dashboard">
          <div className="sidebar">
            <div className="dash-section" id="courses">
              <div className="dash-section-title" onClick={() => toggleOptions('courses')}>
                Courses
              </div>
              {optionsVisibility.courses ? (
                <>
                  <div className="options">

                  {/* <Link className="nav-link" to='updateCourse'>
                    <div className="option">
                      <span className="icon">✎</span> Update
                    </div>
                    </Link>

                    <div className="option">
                      <span className="icon">✖</span> Delete
                    </div> */}
                    {userContext.userData.role === 0 ? (
                      <>
                      <Link className="nav-link" to='/Admin'>
                        <div className="option">
                          <span className="icon">✎</span> Approve Courses
                        </div>
                      </Link>
                      </>
                    ) : <>
                    <Link className="nav-link" to='searchCourse'>
                      <div className="option">
                          <span className="icon">+</span> Search
                      </div>
                    </Link>
                    <Link className="nav-link" to='addCourse'>
                      <div className="option">
                          <span className="icon">+</span> Add
                      </div>
                    </Link>
                    <Link className="nav-link" to='/Instructor'>
                      <div className="option">
                        <span className="icon"></span> My Courses
                      </div>
                    </Link>
                    </>}
                  </div>
                </>
              ) : null}
            </div>
            {userData.role === 1 ? 
            <>
            <div className="dash-section" id="sections">
              <div className="dash-section-title" onClick={() => toggleOptions('sections')}>
                Sections
              </div>
              {optionsVisibility.sections && (
                
                <div className="options">
                  <Link className="nav-link" to='SearchSection'>
                    <div className="option">
                        <span className="icon">+</span> Search
                    </div>
                  </Link>
                  {/* <Link className="nav-link" to='addSection'>
                    <div className="option">
                      <span className="icon">+</span> Add
                    </div>
                  </Link> */}
                  <Link className="nav-link" to='showSections'>
                    <div className="option">
                      <span className="icon"></span> show Sections
                    </div>
                  </Link>
                  {/* <div className="option">
                    <span className="icon">✎</span> Update
                  </div>
                  <div className="option">
                    <span className="icon">✖</span> Delete
                  </div> */}
                </div>
              )}
            </div>
            <div className="dash-section" id="lessons">
              <div className="dash-section-title" onClick={() => toggleOptions('lessons')}>
                Lessons
              </div>
              {optionsVisibility.lessons && (
                <div className="options">
                  <Link className="nav-link" to='SearchLesson'>
                    <div className="option">
                        <span className="icon">+</span> search
                    </div>
                  </Link>
                  {/* <Link className="nav-link" to='addLesson'>
                    <div className="option">
                      <span className="icon">+</span> Add
                    </div>
                  </Link> */}
                  <Link className="nav-link" to='showLessons'>
                    <div className="option">
                      <span className="icon"></span> show Lessons
                    </div>
                  </Link>
                  {/* <div className="option">
                    <span className="icon">✎</span> Update
                  </div>
                  <div className="option">
                    <span className="icon">✖</span> Delete
                  </div> */}
                </div>
              )}
            </div>
            </>: null}
            
            <div className="dash-section" id="categories">
              <div className="dash-section-title" onClick={() => toggleOptions('categories')}>
                categories
              </div>
              {optionsVisibility.categories && (
                
                <div className="options">
                  <Link className="nav-link" to='SearchCategory'>
                    <div className="option">
                        <span className="icon">+</span> search
                    </div>
                  </Link>
                  {userData.role === 0 ? 
                  <>
                    <Link className="nav-link" to='showCategories'>
                      <div className="option">
                        <span className="icon"></span> Show
                      </div>
                    </Link>
                  
                    <Link className="nav-link" to='addCategory'>
                      <div className="option">
                        <span className="icon">+</span> Add
                      </div>
                    </Link>
                  </> : null}

                  {/* <div className="option">
                    <span className="icon">✎</span> Update
                  </div>
                  <div className="option">
                    <span className="icon">✖</span> Delete
                  </div> */}
                </div>
              )}
            </div>
            <div className="dash-section" id="categories">
              <div className="dash-section-title" onClick={() => toggleOptions('create_admin')}>
              Create New Admin
              </div>
              {optionsVisibility.create_admin && (
                
                <div className="options">
                  {userData.role === 0 ? 
                  <>
                  <Link className="nav-link" to='create-admin'>
                    <div className="option">
                        <span className="icon">+</span> Create
                    </div>
                  </Link>
                  </> : null}

                </div>
              )}
            </div>
          </div>
          <div className="main-content">
          {/* <div className="card">
            <div className="card-body">
              <h5 className="card-title">Welcome Back</h5>
              <p className="card-text">{userContext.userData.name}</p>
            </div>
          </div> */}
            <Outlet></Outlet>
          </div>
        </div>
        </div>
        <Footer />
    </div>
        
      </>
    );
  }
}
