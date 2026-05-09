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
  }
}