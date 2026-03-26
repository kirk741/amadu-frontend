import styles from './Layout.module.css';
import TopNav from '../TopNav/TopNav';
import BottomNav from '../BottomNav/BottomNav';
import { useLocation } from "react-router-dom";
import { useEffect } from 'react';

const Layout = ({ children }) => {
  let withBottomNav = true;
  let withTopNav = true;
  const location = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  const withoutBottomNav = [
    '/profile',
    '/login',
    '/register',
    '/emotion-logs',
  ];

  const withoutTopNav = [
    '/register',
    '/login'
  ];

  if (withoutBottomNav.includes(location.pathname)) {
    withBottomNav = false;
  }

  if (withoutTopNav.includes(location.pathname)) {
    withTopNav = false;
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