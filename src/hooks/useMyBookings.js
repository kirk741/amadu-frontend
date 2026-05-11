import { useEffect, useState } from "react";
import { appointmentApi } from "../api/appointment";

export const useMyBookings = () => {
  const [upcoming, setUpcoming] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [pagination, setPagination] = useState(null);

  const fetchUpcoming = async () => {
    try {
      const data = await appointmentApi.getUpcomingAppointment();
      setUpcoming(data);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  const getAppointments = async (page = 1, searchQuery = '', status = '') => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      params.append('page', page);
      if (searchQuery) params.append('search', searchQuery);
      if (status) params.append('status', status);

      const res = await appointmentApi.getAppointments(params.toString());

      setPagination({
        current: res.current_page,
        last: res.last_page,
      });
      return res.data;
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  }

  const cancelAppointment = async (appointmentId) => {
    try {
      const data = await appointmentApi.cancelAppointment(appointmentId);
      return data;
    } catch (e) {
      console.error(e);
      throw e;
    }
  }

  useEffect(() => { fetchUpcoming(); }, []);

  return { upcoming, isLoading, pagination, getAppointments, refresh: fetchUpcoming, cancelAppointment };
}