import React from 'react';
import Header from '../header/Header';
import Footer from '../footer/Footer';
import { Outlet } from 'react-router-dom';
import './layout.css'

export default function Layout(props) {
  return <>
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      { /* using userContext instead of props */}
      {/* <Header  userData={props.userData} saveUserData={props.saveUserData}/> */}
      <Header/>

      <div style={{ flex: 1 }}>
        <Outlet />
      </div>
      <Footer />
    </div>
    </>
}
