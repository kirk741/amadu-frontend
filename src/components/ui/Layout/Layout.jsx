import styles from './Layout.module.css';
import TopNav from '../TopNav/TopNav';
import BottomNav from '../BottomNav/BottomNav';
import { matchPath, useLocation } from "react-router-dom";
import { useEffect } from 'react';

const Layout = ({ children }) => {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  const withoutBottomNav = [
    '/profile',
    '/login',
    '/register',
    '/emotion-logs',
    '/user/:id',
    '/diary/create',
    '/breathing',
    '/grounding',
    '/kalimba',
    '/phones',
    '/phone/:id',
  ];

  const withoutTopNav = [
    '/register',
    '/login'
  ];

  const isBottomNavHidden = withoutBottomNav.some(path =>
    matchPath({ path, exact: true }, location.pathname)
  );

  const isTopNavHidden = withoutTopNav.some(path =>
    matchPath({ path, exact: true }, location.pathname)
  );

  return (
    <div className={styles.layout}>
      {!isTopNavHidden && <TopNav />}
      <div className={styles.wrapper}>{children}</div>
      {!isBottomNavHidden && <BottomNav />}
    </div>
  )
}

export default Layout;