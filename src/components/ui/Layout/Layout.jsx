import styles from './Layout.module.css';
import TopNav from '../TopNav/TopNav';
import BottomNav from '../BottomNav/BottomNav';
import { matchPath, useLocation } from "react-router-dom";
import { useEffect } from 'react';
import { CLIENT_NAV, PSY_NAV } from '../../../config/navigation';
import { useAuthContext } from '../../../context/AuthContext';
import { useGlobalSchedule } from '../../../context/ScheduleContext';
import OfflineNotification from '../OfflineNotification/OfflineNotification'

const Layout = ({ children }) => {
  const location = useLocation();
  const { role } = useAuthContext();
  const { bookings, loadSlots } = useGlobalSchedule();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  useEffect(() => {
    if (role === 'psychologist') {
      loadSlots();
    }
  }, [role]);

  const hasPendingApplications = role === 'psychologist' && bookings.some(b => b.status === 'scheduled');

  const currentNav = role === 'psychologist' ? PSY_NAV : CLIENT_NAV;
  const withoutBottomNav = [
    '/profile', '/login', '/register', '/emotion-logs', '/user/:id',
    '/diary/create', '/breathing', '/grounding', '/kalimba', '/phones',
    '/phone/:id', '/appointment/:id', '/appointments', '/chat/:id',
  ];
  const withoutTopNav = [
    '/register', '/login'
  ];

  const isBottomNavHidden = withoutBottomNav.some(path =>
    matchPath({ path, exact: true }, location.pathname)
  );
  const isTopNavHidden = withoutTopNav.some(path =>
    matchPath({ path, exact: true }, location.pathname)
  );

  const isChatPage = matchPath({ path: '/chat/:id', exact: true }, location.pathname);

  return (
    <div className={`${styles.layout} ${isChatPage ? styles.chatLayout : ''}`}>
      <OfflineNotification />
      {!isTopNavHidden && <TopNav />}

      <div className={styles.wrapper}>
        {children}
      </div>

      {!isBottomNavHidden && <BottomNav items={currentNav} showBadge={hasPendingApplications} />}
    </div>
  );
};

export default Layout;
