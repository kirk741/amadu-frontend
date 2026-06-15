import client from "./client"

export const appointmentApi = {
  getAvailableSlots: async (psychologistId = null) => {
    const params = psychologistId ? { params: { psychologist_id: psychologistId } } : {};
    const res = await client(`/schedules?psychologist_id=${psychologistId}`);
    return res.data;
  },

  createAppointment: async (scheduleId) => {
    const res = await client('/bookings', { body: { schedule_id: scheduleId } });
    return res.data;
  },

  cancelAppointment: async (appointmentId) => {
    const res = await client(`/bookings/${appointmentId}`, { method: 'DELETE' });
    return res.data;
  },

  getAppointments: async (queryString = '') => {
    const url = queryString ? `/bookings?${queryString}` : '/bookings';
    const res = await client(url);
    return res.data;
  },

  getAppointment: async (appointmentId) => {
    const res = await client(`/bookings/${appointmentId}`);
    return res.data;
  },

  getUpcomingAppointment: async () => {
    const res = await client('/bookings');

    const now = new Date();
    const upcoming = res.data.data
      .filter(app => new Date(app.schedule.start_time) > now && app.status === 'confirmed')
      .sort((a, b) => new Date(a.schedule.start_time) - new Date(b.schedule.start_time))[0];
    return upcoming;
  }
}