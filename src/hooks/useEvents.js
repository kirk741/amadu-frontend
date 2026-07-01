import { useState } from 'react';
import client from '../api/client';

export const useEvents = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [pagination, setPagination] = useState(null);

  const getEvents = async (page = 1, search = '') => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      params.append('page', page);
      if (search) params.append('search', search);

      const res = await client(`/events?${params.toString()}`);
      
      setPagination({
        current: res.data.current_page,
        last: res.data.last_page,
      });
      return res.data.data;
    } catch (e) {
      console.error(e);
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  const createEvent = async (formData) => {
    try {
      return await client('/events', { body: formData });
    } catch (e) {
      console.error(e);
      throw e;
    }
  };

  const updateEvent = async (id, formData) => {
    try {
      formData.append('_method', 'PATCH');
      return await client(`/events/${id}`, { body: formData });
    } catch (e) {
      console.error(e);
      throw e;
    }
  };

  const deleteEvent = async (id) => {
    try {
      const data = new FormData();
      data.append('_method', 'DELETE');
      return await client(`/events/${id}`, { body: data });
    } catch (e) {
      console.error(e);
      throw e;
    }
  };

  return { isLoading, pagination, getEvents, createEvent, updateEvent, deleteEvent };
};
