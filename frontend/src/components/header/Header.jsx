import React from 'react'
import NavBar from '../navbar/NavBar'
export default function Header(props) {
  return <>
  <div >
    {/* <NavBar userData={props.userData} saveUserData={props.saveUserData}/> */}
    { /* using userContext instead of props */}
    <NavBar/>

  </div>
  </>
}
