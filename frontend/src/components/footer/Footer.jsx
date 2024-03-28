import React from 'react'
import '../footer/Footer.scss'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFacebook, faTwitter, faInstagram, faLinkedin } from '@fortawesome/free-brands-svg-icons';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
  <div className="footer-dark">
    <footer>
        <div className="container">
            <div className="row">
                <div className="col-sm-6 col-md-3 item">
                    <h3>Services</h3>
                    <ul>
                        <li><Link to="#">Web design</Link></li>
                        <li><Link to="#">Development</Link></li>
                        <li><Link to="#">Hosting</Link></li>
                    </ul>
                </div>
                <div className="col-sm-6 col-md-3 item">
                    <h3>About</h3>
                    <ul>
                        <li><Link to="#">Company</Link></li>
                        <li><Link to="#">Team</Link></li>
                        <li><Link to="#">Careers</Link></li>
                    </ul>
                </div>
                <div className="col-md-6 item text">
                    <h3>Course Hub</h3>
                    <p>Free courses for every one learn any thing and boost your carrer now !</p>
                </div>
                <div className="effect aeneas">
                  <div className="buttons">
                  <Link to="#" className="fb" title="Join us on Facebook"><FontAwesomeIcon icon={faFacebook} /></Link>
                  <Link to="#" className="tw" title="Join us on Twitter"><FontAwesomeIcon icon={faTwitter} /></Link>
                  <Link to="#" className="insta" title="Join us on Instagram"><FontAwesomeIcon icon={faInstagram} /></Link>
                  <Link to="#" className="in" title="Join us on LinkedIn"><FontAwesomeIcon icon={faLinkedin} /></Link>
                  </div>
                </div>            
            </div>
            <p className="copyright">Course Hub @2024</p>
        </div>
    </footer>
  </div>
  )
}
