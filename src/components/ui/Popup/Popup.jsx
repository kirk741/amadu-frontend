import styles from './Popup.module.css';

const Popup = ({ elementData = [] }) => {
  return (
    <ul className={styles.popupContainer}>
      {
        elementData.map((item, index) =>
          <li key={index} className={styles.popupButton}><button onClick={item.onClick}>{item.name}</button></li>
        )
      }
    </ul>
  )
}

export default Popup;