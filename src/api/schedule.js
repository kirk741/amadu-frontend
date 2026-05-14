import client from "./client"

export const scheduleApi = {
  getSlots: async () => {
    const res = await client('/schedules')
    return res.data;
  }
}