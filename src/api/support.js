import client from "./client";

export const supportApi = {
  getPhones: (page = 1, search = '') =>
    client(`/support-phones?page=${page}&search=${search}`).then(res => res.data),
  getPhone: (id) => client(`/support-phones/${id}`).then(res => res.data)
};