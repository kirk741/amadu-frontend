import { useState, useRef } from "react";
import client from "../api/client";

export const useSchedule = () => {
  const [slots, setSlots] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const isFetching = useRef(false);
  const savedPsychologistId = useRef(null);

  const loadSlots = async (psychologistId = null) => {
    if (isFetching.current) return;

    if (psychologistId) {
      savedPsychologistId.current = psychologistId;
    }

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
      console.error("Ошибка загрузки:", e);
    } finally {
      setIsLoading(false);
      isFetching.current = false;
    }
  };

  const deleteSlot = async (id) => {
    try {
      const data = new FormData();
      data.append('_method', 'DELETE');
      await client(`/schedules/${id}`, { body: data });
      await loadSlots();
    } catch (e) {
      console.error("Ошибка удаления слота:", e);
    }
  };

  const generateSlots = async (formData) => {
    try {
      await client('/schedules/generate', { body: formData });
      await loadSlots();
    } catch (e) {
      console.error("Ошибка генерации слотов:", e);
      throw e;
    }
  };

  const updateSlotTime = async (id, formDataValues) => {
    try {
      const data = new FormData();
      data.append('start_time', formDataValues.start_time);
      data.append('end_time', formDataValues.end_time);
      data.append('_method', 'PATCH');
      await client(`/schedules/${id}`, { body: data });
      await loadSlots();
    } catch (e) {
      console.error("Ошибка обновления времени слота:", e);
      throw e;
    }
  };

  const updateAppointmentStatus = async (id, status) => {
    try {
      const data = new FormData();
      data.append('status', status);
      data.append('_method', 'PATCH');
      await client(`/bookings/${id}`, { body: data });
      await loadSlots();
    } catch (e) {
      console.error("Ошибка подтверждения записи:", e);
    }
  };

  const cancelAppointment = async (id) => {
    try {
      const data = new FormData();
      data.append('_method', 'DELETE');
      await client(`/bookings/${id}`, { body: data });
      await loadSlots();
    } catch (e) {
      console.error("Ошибка отмены записи:", e);
    }
  };

  return {
    loadSlots,
    slots,
    bookings,
    isLoading,
    deleteSlot,
    generateSlots,
    updateSlotTime,
    updateAppointmentStatus,
    cancelAppointment
  };
};
