import { useEffect } from "react";
import { useSchedule } from "../../../hooks/useSchedule";
import Appointment from "./Appointment/Appointment";
import PsychologistSchedule from "./Calendar/PsychologistSchedule/PsychologistSchedule";
import Statistics from "./Statistics/Statistics";

const HomePage = () => {
  const {
    loadSlots,
    slots,
    bookings,
    isLoading,
    generateSlots,
    deleteSlot,
    updateSlotTime,
    updateAppointmentStatus,
    cancelAppointment
  } = useSchedule();

  useEffect(() => {
    loadSlots();
  }, []);

  return (
    <>
      <Appointment />
      <Statistics />
      <PsychologistSchedule
        slots={slots}
        bookings={bookings}
        isLoading={isLoading}
        onGenerateSlots={generateSlots}
        onDeleteSlot={deleteSlot}
        onUpdateSlotTime={updateSlotTime}
        onUpdateSlotStatus={updateAppointmentStatus}
        onCancelAppointment={cancelAppointment}
      />
    </>
  );
};

export default HomePage;
