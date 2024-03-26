import React, { useContext, useEffect, useState } from 'react'
import config from '../config'
import { useNavigate } from 'react-router-dom';
import { Button, Modal } from 'react-bootstrap';
import { UserDataContext } from '../UserContextProvider/UserContextProvider';
import api from '../api';

export default function Logout(props) {
  const userContext = useContext(UserDataContext);
  const navigate = useNavigate();
  const axiosConfig = {
    headers: { 'Authorization': 'Bearer ' + localStorage.getItem('access_token') }
  };

  async function logOutUser() {
    try {
      let response  = await api.get(`${config.auth}/logout`, axiosConfig);
      if (response.status === 200) {
        doLogOut();
      }
    } catch(error) {
      console.error(error);
      doLogOut();
    }
  }
      
  const [showModal, setShowModal] = useState(true);

  
  const handleLogout = () => {
    logOutUser();
    setShowModal(false);
    navigate('/login')
  };

  
  useEffect(() => {
    if (showModal) {
      document.getElementById('closeButton').focus();
    }
  }, [showModal]);
  return <>
        <div>

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Logout Confirmation</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Are you sure you want to logout?</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" id="closeButton" onClick={() => {
            setShowModal(false);
            navigate('/') }}>
            Close
            
          </Button>
          <Button variant="danger" onClick={handleLogout}>
            Logout
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  </>

  function doLogOut() {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    userContext.setUserData(null);
    navigate('/login');
  }
}
