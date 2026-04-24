import styles from './TopNav.module.css';
import Button from '../Button/Button'
import { useLocation, useNavigate } from 'react-router-dom';
import * as Icons from '../../../assets/icons';
import { useEffect, useState } from 'react';
import Modal from '../Modal/Modal';
import SettingsModal from '../SettingsModal/SettingsModal';

const TopNav = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const isHome = location.pathname === '/';

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const paths = [
    { path: '/', content: getGreetingText() },
    { path: '/events', content: 'Мероприятия' },
    { path: '/psychologists', content: 'Психологи' },
    { path: '/chats', content: 'Чаты' },
    { path: '/diary', content: 'Дневники' },
    { path: '/diary/trash', content: 'Корзина' },
    { path: '/profile', content: 'Профиль' },
    { path: '/emotion-logs', content: 'Эмоции' },
    { path: '/breathing', content: 'Дыхание' },
    { path: '/grounding', content: 'Заземление' },
    { path: '/kalimba', content: 'Калимба' },
  ];

  const currentPath = paths.find(item => item.path === location.pathname);

  function getGreetingText(time = new Date().getHours()) {
    if (time < 6 || time >= 22) return 'Доброй ночи';
    if (time >= 18) return 'Добрый вечер';
    if (time >= 12) return 'Добрый день';
    if (time >= 6) return 'Доброе утро';
    return 'Привет!';
  }

  const handleBackClick = () => {
    if (isHome) {
      navigate('/profile');
    } else {
      navigate(-1);
    }
  };

  return (
    <>
      <div className={`${styles.topNav} ${isScrolled && isHome ? styles.hidden : ''}`}>
        <Button
          className={styles.topNavBtn}
          shadowType='s'
          onClick={handleBackClick}
        >
          {isHome ? <Icons.Profile /> : <Icons.ArrowBack />}
        </Button>

        <span className={`${styles.topNavTitle} ${isScrolled && !isHome ? styles.hidden : ''}`}>
          {currentPath ? currentPath.content : ''}
        </span>

        <Button
          className={`${styles.topNavBtn} ${isScrolled && !isHome ? styles.hidden : ''}`}
          shadowType='s'
          onClick={() => setIsSettingsOpen(true)}
        >
          <Icons.Settings />
        </Button>
      </div>
      {
        isSettingsOpen && (
          <SettingsModal onClose={() => setIsSettingsOpen(false)} />
        )
      }
    </>
  );
}

export default TopNav;
