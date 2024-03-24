import React from "react";
import { Button } from "react-bootstrap";
import "./About.css";
import { useContext } from "react";
import { UserDataContext } from "../UserContextProvider/UserContextProvider";

function About() {
  const userContext = useContext(UserDataContext);
  const userData = userContext.userData;

  const handleContact = (email) => {
    const subject = encodeURIComponent("From CourseHub User");
    const body = encodeURIComponent("Hello, \n\nI'm " + userData.name + ".\n");
    const mailToURL =
      "mailto:" + email + "?subject=" + subject + "&body=" + body;

    window.open(mailToURL);
  };

  return (
    <>
      <div className="about-section about-body">
        <h1>About Us Page</h1>
        <p>Some text about who we are and what we do.</p>
        <p>
          Resize the browser window to see that this page is responsive by the
          way.
        </p>
      </div>
      <br />
      <br />
      <h2 style={{ textAlign: "center" }}>Our Team</h2>
      <div className="about-row">
        <div className="about-column">
          <div className="about-card">
            <img
              src="./users/yousef.jpg"
              alt="Yousef"
              style={{ width: "100%", height: "500px", paddingLeft: "10%", paddingRight: "10%", paddingTop: "5px"}}
            />
            <div className="about-container">
              <br />
              <h2>Yousef Ahmed</h2>
              <p className="title">Software Engineer</p>
              <p>Some text that describes me lorem ipsum ipsum lorem.</p>
              <p>GitHub: <a href="https://github.com/Y-Baker" className="redirect">Y-Baker</a></p>
              <p>
                <Button
                  className="basic-p about-button"
                  variant="primary"
                  onClick={() => handleContact("yuossefbakier@gmail.com")}
                >
                  Contact
                </Button>
              </p>
            </div>
          </div>
        </div>
        <div className="about-column">
          <div className="about-card">
            <img
              src="./users/AbdullahKhames.jpg"
              alt="Abdullah"
              style={{ width: "100%", height: "500px", paddingLeft: "10%", paddingRight: "10%", paddingTop: "5px"}}
            />
            <div className="about-container">
            <br />
              <h2>Abdullah Khames</h2>
              <p className="title">Software Engineer</p>
              <p>Some text that describes me lorem ipsum ipsum lorem.</p>
              <p>GitHub: <a href="https://github.com/AbdullahKhames" className="redirect">AbdullahKhames</a></p>
              <p>
                <Button
                  className="basic-p about-button"
                  variant="primary"
                  onClick={() => handleContact("abdallahyouniiss@gmail.com")}
                >
                  Contact
                </Button>
              </p>
            </div>
          </div>
        </div>
        <div className="about-column">
          <div className="about-card">
            <img
              src="./users/Mohammed.jpg"
              alt="Mohamed"
              style={{ width: "100%", height: "500px", paddingLeft: "10%", paddingRight: "10%", paddingTop: "5px"}}
            />
            <div className="about-container">
            <br />
              <h2>Mohamed Elshafae</h2>
              <p className="title">Software Engineer</p>
              <p>Some text that describes me lorem ipsum ipsum lorem.</p>
              <p>GitHub: <a href="https://github.com/MohamedElshafae" className="redirect">MohamedElshafae</a></p>
              <p>
                <Button
                  className="basic-p about-button"
                  variant="primary"
                  onClick={() => handleContact("mohamedelshafae888@gmail.com")}
                >
                  Contact
                </Button>
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default About;
