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

  getAppointments: async (page = 1, searchQuery = '') => {
    const searchParam = searchQuery ? `&search=${searchQuery}` : '';
    const res = await client(`/bookings?page=${page}${searchParam}`);
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