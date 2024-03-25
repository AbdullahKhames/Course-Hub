import React from "react";
import { Card, Button } from "react-bootstrap";
import Loading from "../../Loading/loading";
import api from "../../api";
import config from "../../config";
import toast, { Toaster } from "react-hot-toast";
import { useContext, useEffect, useState } from "react";
import { UserDataContext } from "../../UserContextProvider/UserContextProvider";
import { useNavigate } from "react-router-dom";
import "./EnrollCard.css";

function EnrollCard({ user, course }) {
  const userContext = useContext(UserDataContext);
  const userData = userContext.userData;
  const [enrollState, setEnrollState] = useState(false);
  const [loading, setLoading] = useState(true);
  const [enrollData, setEnrollData] = useState(null);
  const [instructor, setInstructor] = useState(null);
  const [instructorOwner, setInstructorOwner] = useState(false);
  const [lastEnrollment, setLastEnrollment] = useState(null);
  const navigate = useNavigate();
  let url_api = "";

  const checkEnroll = (url_api) => {
    api
      .get(`${url_api}`)
      .then((res) => {
        if (res.status === 200) {
          if (res.data.data) {
            setEnrollState(true);
            setEnrollData(res.data.data);
            setLoading(false);
          } else {
            setEnrollState(false);
            setLoading(false);
          }
        }
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  };

  const enroll = (url_api) => {
    api
      .post(`${url_api}`, {})
      .then((res) => {
        if (res.status === 201) {
          window.location.reload();
          setEnrollState(true);
          setEnrollData(res.data.data);
          toast.success(res.data.message);
        }
      })
      .catch((err) => {
        console.error(err);
        navigate("/forbidden");
      });
  };

  const unenroll = (url_api) => {
    api
      .delete(`${url_api}`)
      .then((res) => {
        if (res.status === 200) {
          window.location.reload();
          setEnrollState(false);
          setEnrollData(null);
          toast.success(res.data.message);
        }
      })
      .catch((err) => {
        console.error(err);
        if (err.response.status === 403) {
          navigate("/forbidden");
          return;
        }
        navigate("/not-found");
      });
  };

  const checkOwner = (url_api, course) => {
    api
      .get(`${url_api}`)
      .then((res) => {
        if (res.status === 200) {
          setInstructor(res.data);
          setLoading(false);
        }
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
    if (course.instructor_id === userData.id) {
      setInstructorOwner(true);
    }
  };

  useEffect(() => {
    if (userData === null) {
      setLoading(false);
      return;
    }
    if (userData.id !== user.id) {
      navigate("/forbidden");
      return;
    }
    if (userData.role === 0) {
      lastPurchase(course);
      setLoading(false);
    } else if (userData.role === 1) {
      url_api = config.api + "/users/" + userData.id + "?all=true";
      setLoading(true);
      checkOwner(url_api, course);
      lastPurchase(course);
    } else if (userData.role === 2) {
      url_api = config.api + "/enrollments/" + course.id + "/" + user.id;
      setLoading(true);
      checkEnroll(url_api);
    }
  }, [userData]);

  const handleLogin = (mess) => {
    navigate("/login", { state: { error: mess } });
  };

  const handleEnroll = (user, course) => {
    if (!user) {
      handleLogin("Please Login to Enroll");
      return;
    } else if (user.role === 0) {
      navigate("/forbidden");
      return;
    } else if (user.role === 1) {
      navigate("/forbidden");
      return;
    } else if (user.role === 2) {
      if (enrollState) {
        navigate("/forbidden");
        return;
      }
      url_api = config.api + "/enrollments/" + course.id + "/" + user.id;
      enroll(url_api);
      // window.location.reload();
    }
  };

  const handleUnenroll = (user, course) => {
    if (!user) {
      navigate("/login");
      return;
    } else if (user.role === 0) {
      navigate("/forbidden");
      return;
    } else if (user.role === 1) {
      navigate("/forbidden");
      return;
    } else if (user.role === 2) {
      url_api = config.api + "/enrollments/" + course.id + "/" + user.id;
      unenroll(url_api);
      // window.location.reload();
    }
  };

  const handleEdit = (course) => {
    if (user.role === 1) {
      navigate(`/instructor/updateCourse/${course.id}`, {
        state: { courseData: course },
      });
    }
  };

  const handleDelete = (course) => {
    api
      .delete(`${config.api}/courses/${course.id}`)
      .then((response) => {
        toast.success("Deleted Successfully", {
          duration: 5000,
        });
        setTimeout(() => {
          navigate("/courses");
        }, 800);
      })
      .catch((error) => {
        console.error(error);
        toast.error("Error deleting course", {
          duration: 5000,
        });
      });
  };

  const handleContact = (userId) => {
    api
      .get(`${config.api}/users/${userId}`)
      .then((res) => {
        if (res.status === 200) {
          const subject = encodeURIComponent("Course Inquiry");
          const body = encodeURIComponent(
            "Hello, \n\nI am student in your course " + course.name + ".\n"
          );
          const mailToURL =
            "mailto:" +
            res.data.email +
            "?subject=" +
            subject +
            "&body=" +
            body;

          window.open(mailToURL);
        }
      })
      .catch((err) => {
        console.error(err);
      });
  };

  const lastPurchase = (course) => {
    api
      .get(`${config.api}/enrollments/${course.id}/last`)
      .then((res) => {
        if (res.status === 200) {
          setLastEnrollment(res.data);
        }
      })
      .catch((err) => {
        return;
      });
  };

  const headerText = (user, owner) => {
    if (!user) {
      return "Enroll Details";
    }
    if (user.role === 0) {
      return "Management";
    } else if (user.role === 1) {
      if (owner) {
        return "Management";
      }
      return "Enroll Details";
    } else if (user.role === 2) {
      return "Enroll Details";
    }
  };

  const bodyText = (user, owner, enroll) => {
    if (!user) {
      return "Get it for Free";
    }
    if (user.role === 0) {
      return lastEnrollment
      ? "Last Purchase: " +
          lastEnrollment.enrolled_date
            .substring(0, 10)
            .replace(/-/g, "/")
            .split("/")
            .reverse()
            .join("/")
      : "No Purchase yet";
    } else if (user.role === 1) {
      if (owner) {
        return lastEnrollment
          ? "Last Purchase: " +
              lastEnrollment.enrolled_date
                .substring(0, 10)
                .replace(/-/g, "/")
                .split("/")
                .reverse()
                .join("/")
          : "No Purchase yet";
      }
      return "Login as Student to Enroll";
    } else if (user.role === 2) {
      if (enroll) {
        return (
          "You purchased this course on: " +
          enrollData.enrolled_date
            .substring(0, 10)
            .replace(/-/g, "/")
            .split("/")
            .reverse()
            .join("/")
        );
      }
      return "Get it for Free";
    }
  };

  const buttons = (user, owner, enroll) => {
    const b1 = (
      <Button
        className="basic-p mr ml"
        variant="primary"
        block
        onClick={() => handleEnroll(user, course)}
      >
        Enroll Now
      </Button>
    );
    const b2 = (
      <Button
        className="mr ml"
        variant="danger"
        block
        onClick={() => handleUnenroll(user, course)}
      >
        Unenroll
      </Button>
    );
    const b3 = (
      <Button
        className="mr ml"
        variant="secondary"
        block
        onClick={() => handleEdit(course)}
      >
        Edit Course
      </Button>
    );
    const b4 = (
      <Button
        className="mr ml"
        variant="danger"
        block
        onClick={() => handleDelete(course)}
      >
        Delete Course
      </Button>
    );
    const b5 = (
      <Button
        className="mr ml"
        variant="secondary"
        block
        onClick={() => handleContact(course.instructor_id)}
      >
        Contact Instructor
      </Button>
    );
    const b6 = (
      <Button className="basic-p mr ml" variant="primary" block disabled>
        Enroll Now
      </Button>
    );

    if (!user) {
      return b1;
    }
    if (user.role === 0) {
      return (
        <>
          {b4}
          {b5}
        </>
      );
    } else if (user.role === 1) {
      if (owner) {
        return (
          <>
            {b3}
            {b4}
          </>
        );
      }
      return b6;
    } else if (user.role === 2) {
      if (enroll) {
        return (
          <>
            {b2}
            {b5}
          </>
        );
      }
      return b1;
    }
  };

  if (loading) {
    return <Loading />;
  } else {
    return (
      <Card className="mt-3">
        <Card.Header as="h5">{headerText(user, instructorOwner)}</Card.Header>
        <Card.Body>
          {(user && user.role === 0) && (<Card.Text>Admin Management</Card.Text>)}
          <Card.Text>{bodyText(user, instructorOwner, enrollState)}</Card.Text>
          <div className="enroll-buttons">
            {buttons(user, instructorOwner, enrollState)}
            <Toaster />
          </div>
        </Card.Body>
      </Card>
    );
  }
}

export default EnrollCard;
