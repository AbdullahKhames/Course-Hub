import React, { useEffect, useState, useCallback } from 'react';
import { Navigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

export default function ProtectedRoute(props) {
  const [userData, setUserData] = useState(null);
  const tokenToUserData = (decodedToken) => {
    return {
      name: decodedToken.name,
      id: decodedToken.sub,
      email: decodedToken.email,
      role: decodedToken.role,
    };
  };

  const saveUserData = useCallback(() => {
    let encodedToken = localStorage.getItem('access_token');
    if (encodedToken !== null) {
      let decodedToken = jwtDecode(encodedToken);
      setUserData(tokenToUserData(decodedToken));
    } else {
      setUserData(null);
    }
  }, []);
  if (userData === null && localStorage.getItem('access_token')) {
   saveUserData();
  }

  useEffect(() => {
    saveUserData();
  }, [localStorage.getItem('access_token')]);

  const rolesOptions = {
   0:'Admin',
   1:'Instructor',
   2:'Student' 
  } 

  function getRoleFromUserData() {
   if (userData === null && localStorage.getItem('access_token')) {
      saveUserData();
     }
   if (userData && userData.role !== null){
      return rolesOptions[userData.role];
   }
   else{
      return null;
   }
  
 }
  
  if (userData === null) {
    return <Navigate to={'/login'} />;
  } else {
    const userRole = getRoleFromUserData();
    if (!props.roles || props.roles.includes(userRole)) {
      return props.children;
    }

    return <Navigate to={'/forbidden'} />;
  }
}
