import styles from './BottomNav.module.css';
import * as Icons from '../../../assets/icons';
import { NavLink, useNavigate } from "react-router-dom";
import { useEffect, useRef } from 'react';

const BottomNav = () => {
  const navItems = [
    { path: '/events', Icon: Icons.Events },
    { path: '/psychologists', Icon: Icons.Psychologist },
    { path: '/', Icon: Icons.Home },
    { path: '/chats', Icon: Icons.Chats },
    { path: '/diary', Icon: Icons.Diary }
  ];

  const navRef = useRef(null);
  const indicatorRef = useRef(null);
  const location = useNavigate();

  useEffect(() => {
    const activeElement = navRef.current?.querySelector(`.${styles.active}`);
    if (activeElement) {
      handleTransition(activeElement, 0);
    }
  }, []);

  useEffect(() => {
    const activeElement = navRef.current?.querySelector(`.${styles.active}`);
    if (activeElement) {
      handleTransition(activeElement);
    }
  }, [location]);

  const handleTransition = (targetElement, duration = 600) => {
    const indicator = indicatorRef.current;
    const targetRect = targetElement.getBoundingClientRect();
    const parentRect = navRef.current.getBoundingClientRect();

    const targetLeft = targetRect.left - parentRect.left + (targetRect.width / 2) - 27;

    indicator.animate([
      { transform: 'translateY(0px)' },
      { transform: 'translateY(12px)', offset: 0.3 },
      { transform: 'translateY(12px)', left: `${targetLeft}px`, offset: 0.7 },
      { transform: 'translateY(0px)', left: `${targetLeft}px` }
    ], {
      duration: duration,
      easing: 'ease-in-out',
      fill: 'forwards'
    });
  };

  return (
    <nav className={styles.bottomNav}>
      <div ref={indicatorRef} className={styles.indicator}></div>
      <ul ref={navRef} className={styles.navList}>
        {navItems.map(({ path, Icon }, index) =>
          <li key={index} className={styles.navItem}>
            <NavLink to={path} onClick={(e) => handleTransition(e.currentTarget)} className={({ isActive }) => isActive ? styles.active : ''}>
              <Icon />
            </NavLink>
          </li>
        )}
      </ul>
    </nav >
  );
}

export default BottomNav;