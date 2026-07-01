import { createContext, useContext, useState, useRef } from 'react';
import client from '../api/client';

const ScheduleContext = createContext(null);

export const ScheduleProvider = ({ children }) => {
  const [slots, setSlots] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const isFetching = useRef(false);
  const savedPsychologistId = useRef(null);

  const loadSlots = async (psychologistId = null) => {
    if (isFetching.current) return;
    if (psychologistId) savedPsychologistId.current = psychologistId;

    isFetching.current = true;
    setIsLoading(true);
    try {
      const bookingsUrl = savedPsychologistId.current
        ? `/bookings?psychologist_id=${savedPsychologistId.current}`
        : '/bookings';

      const [slotsData, bookingsData] = await Promise.all([
        client('/schedules'),
        client(bookingsUrl)
      ]);
      setSlots(slotsData?.data || slotsData || []);
      setBookings(bookingsData?.data?.data || bookingsData?.data || bookingsData || []);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
      isFetching.current = false;
    }
  };

  return (
    <ScheduleContext.Provider value={{ slots, bookings, isLoading, loadSlots, setBookings, setSlots }}>
      {children}
    </ScheduleContext.Provider>
  );
};

export const useGlobalSchedule = () => useContext(ScheduleContext);
