import { useEffect } from "react";
import { useBooking } from "../../../hooks/useBooking";
import { useNavigate, useParams } from "react-router-dom";
import Calendar from "./Calendar/Calendar";
import { useUser } from "../../../hooks/useUser";
import Container from "../../../components/ui/Container/Container";
import * as Icons from "../../../assets/icons";
import styles from "./BookingPage.module.css";
import List from "../../../components/ui/List/List";
import UserInfo from "./UserInfo/UserInfo";

const BookingPage = () => {
  const { id } = useParams();
  const { user, isLoading } = useUser(id);

  return (<div className={styles.wrapper}>
    <UserInfo user={user} isLoading={isLoading} />
    <Calendar />
  </div>
  )
}

export default BookingPage;