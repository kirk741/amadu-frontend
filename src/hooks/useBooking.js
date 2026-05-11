import { useEffect, useState } from "react";
import { appointmentApi } from "../api/appointment"

export const useBooking = (psychologistId, slotId = '') => {
  const [slots, setSlots] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAppointmentLoading, setIsAppointmentLoading] = useState(true);
  const [appointmentSuccess, setAppointmentSuccess] = useState(true);

  const loadData = async () => {
    try {
      const data = await appointmentApi.getAvailableSlots(psychologistId);
      setSlots(data);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  const createAppointment = async (slotId) => {
    setIsAppointmentLoading(true);
    try {
      const data = await appointmentApi.createAppointment(slotId);
      setAppointmentSuccess(data.success);
      return data;
    } catch (e) {
      console.error(e);
      throw e;
    } finally {
      setIsAppointmentLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [psychologistId]);

  return { slots, isLoading, createAppointment, loadData };
}