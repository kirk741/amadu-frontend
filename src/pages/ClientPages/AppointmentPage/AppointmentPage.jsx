import { useEffect } from "react";
import { useBooking } from "../../../hooks/useBooking";
import { useNavigate, useParams } from "react-router-dom";
import Calendar from "./Calendar/Calendar";
import { useUser } from "../../../hooks/useUser";
import Container from "../../../components/ui/Container/Container";
import * as Icons from "../../../assets/icons";
import styles from "./AppointmentPage.module.css";
import List from "../../../components/ui/List/List";

const AppointmentPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { slots, loading } = useBooking(id);

  const { user, isLoading } = useUser(id);

  return (<>
    <div className={styles.userContainer}>
      <img className={`${styles.psychologistImage} ${styles.userAvatar}`} src={`${process.env.REACT_APP_API_URL}/storage/${user?.media[0].file_path}`} alt={user?.name} />
      <div className={styles.userData}>
        <span>{user?.name}</span>
        <small>{user?.last_seen_at || "Был(а) в сети"}</small>
      </div>
    </div>

    <Calendar />
  </>
  )
}

export default AppointmentPage;