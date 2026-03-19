import React from "react";
import styles from './Layout.module.css';
import TopNav from '../TopNav/TopNav';
import BottomNav from '../BottomNav/BottomNav';
import Container from '../Container/Container';
import { useLoaderData, useLocation, useNavigate } from "react-router-dom";

const Layout = ({ children }) => {
  let withBottomNav = true;
  let withTopNav = true;
  const location = useLocation();

  const withoutBottomNav = [
    '/profile'
  ];

  if (withoutBottomNav.includes(location.pathname)) {
    withBottomNav = false;
  }

  return (
    <div className={styles.layout}>
      {withTopNav && <TopNav />}
      <div className={styles.wrapper} >{children}</div>
      {withBottomNav && <BottomNav />}
    </div>
  )
}

export default Layout;