import { useState } from "react";
import { useParams } from "react-router-dom";
import { useBooking } from "../../../hooks/useBooking";
import { useUser } from "../../../hooks/useUser";
import UserInfo from "./UserInfo/UserInfo";
import Calendar from "../../../components/ui/Calendar/Calendar";
import CalendarModal from "../../../components/ui/Calendar/CalendarModal/CalendarModal";
import styles from "./BookingPage.module.css";

const BookingPage = () => {
  const { id } = useParams();
  const { user, isLoading: isUserLoading } = useUser(id);
  const { slots, createAppointment, loadData, isLoading: isSlotsLoading } = useBooking(id);

  const [selectedDay, setSelectedDay] = useState('');
  const [selectedSlot, setSelectedSlot] = useState('');
  const [status, setStatus] = useState('');

  const renderClientStatus = () => {
    if (isSlotsLoading) return <span>~ Ищем доступное время</span>;
    if (slots.length === 0) return <span>! Нет доступного времени</span>;
    return <span>✓ Есть доступное время</span>;
  };

  return (
    <div className={styles.wrapper}>
      <UserInfo user={user} isLoading={isUserLoading} />

      <Calendar
        slots={slots}
        isLoading={isSlotsLoading}
        onDayClick={setSelectedDay}
        renderStatus={renderClientStatus}
      />

      {selectedDay && (
        <CalendarModal
          selectedDay={selectedDay}
          setSelectedDay={setSelectedDay}
          selectedSlot={selectedSlot}
          setSelectedSlot={setSelectedSlot}
          status={status}
          setStatus={setStatus}
          slots={slots}
          createAppointment={createAppointment}
          loadData={loadData}
        />
      )}
    </div>
  );
};

export default BookingPage;