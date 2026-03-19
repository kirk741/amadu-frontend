import EmotionChart from "./EmotionChart/EmotionChart";
import HomePageOptions from "./HomePageOptions/HomePageOptions";
import styles from './HomePage.module.css';
import Appointment from "./Appointment/Appointment";

const HomePage = () => {
  return (
    <div className={styles.container}>
      <Appointment />
      <EmotionChart />
      <HomePageOptions />
    </div>
  )
}

export default HomePage;