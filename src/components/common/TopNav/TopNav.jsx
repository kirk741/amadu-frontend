import styles from './TopNav.module.css';
import Button from '../Button/Button'
import { Link, useLocation } from 'react-router-dom';
import * as Icons from '../../../assets/icons';

const TopNav = () => {
  const location = useLocation();

  const paths = [
    { path: '/', content: getGreetingText() },
    { path: '/events', content: 'Мероприятия' },
    { path: '/psychologists', content: 'Психологи' },
    { path: '/chats', content: 'Чаты' },
    { path: '/diary', content: 'Дневники' },
    { path: '/profile', content: 'Профиль' },
  ];

  const currentPath = paths.find(item => item.path === location.pathname);

  function getGreetingText(time = new Date().getHours()) {
    if(time < 6 || time >= 22) return 'Доброй ночи';
    else if(time >= 18) return 'Добрый вечер';
    else if(time >= 12) return 'Добрый день';
    else if(time >= 6) return 'Доброе утро';
    else return 'Привет!';
  }

  return (
    <div className={styles.topNav}>
      <Link to={location.pathname === '/' ? '/profile' : '/'}>
        <Button className={styles.topNavBtn} shadowType='s'>
          {location.pathname === '/' ? <Icons.Profile /> : <Icons.ArrowBack />}
        </Button>
      </Link>
      <span className={styles.topNavTitle}>
        {currentPath ? currentPath.content : ''}
      </span>
      <Button className={styles.topNavBtn} shadowType='s'>
        <Icons.Settings />
      </Button>
    </div>
  );
}

export default TopNav;