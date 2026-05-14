import { useEffect } from "react";
import Calendar from "../../../components/ui/Calendar/Calendar";
import { useBooking } from "../../../hooks/useBooking";
import { useSchedule } from "../../../hooks/useSchedule";

const HomePage = () => {
  const { loadSlots, slots, isLoading } = useSchedule();

  useEffect(() => {
    loadSlots();
  }, []);

  return (
    <Calendar slots={slots} isLoading={isLoading} />
  )
}

export default HomePage;