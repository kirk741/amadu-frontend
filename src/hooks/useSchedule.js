import { useState } from "react";
import { scheduleApi } from "../api/schedule";

export const useSchedule = () => {
  const [slots, setSlots] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadSlots = async () => {
    setIsLoading(true);
    try {
      const data = await scheduleApi.getSlots();
      setSlots(data);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  return { loadSlots, slots, isLoading };
}