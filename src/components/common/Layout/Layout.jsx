import styles from './Layout.module.css';
import TopNav from '../TopNav/TopNav';
import BottomNav from '../BottomNav/BottomNav';
import { useLocation } from "react-router-dom";

const Layout = ({ children }) => {
  let withBottomNav = true;
  let withTopNav = true;
  const location = useLocation();

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