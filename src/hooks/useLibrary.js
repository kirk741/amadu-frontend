import { useState } from 'react';
import client from '../api/client';

export const useLibrary = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [pagination, setPagination] = useState(null);

  const getBooks = async (page = 1, search = '', psychologistId = '') => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      params.append('page', page);
      if (search) params.append('search', search);

      if (psychologistId) params.append('psychologist_id', psychologistId);

      const res = await client(`/books?${params.toString()}`);

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

  const createBook = async (formData) => {
    try {
      return await client('/books', { body: formData });
    } catch (e) {
      console.error(e);
      throw e;
    }
  };

  const updateBook = async (id, formData) => {
    try {
      formData.append('_method', 'PATCH');
      return await client(`/books/${id}`, { body: formData });
    } catch (e) {
      console.error(e);
      throw e;
    }
  };

  const deleteBook = async (id) => {
    try {
      const data = new FormData();
      data.append('_method', 'DELETE');
      return await client(`/books/${id}`, { body: data });
    } catch (e) {
      console.error(e);
      throw e;
    }
  };

  return { isLoading, pagination, getBooks, createBook, updateBook, deleteBook };
};
