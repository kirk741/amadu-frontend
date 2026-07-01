import client from "./client";

export const scheduleApi = {
  getSlots: () =>
    client('/schedules'),

  deleteSlot: (id) =>
    client(`/schedules/${id}`, { method: 'DELETE' }),

  generateSlots: (payload) =>
    client('/schedules/generate', { body: payload })
};
