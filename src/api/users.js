import client from "./client";

export const usersApi = {
  getPsychologists: (page = 1, search = '') =>
    client(`/user?page=${page}&search=${search}`).then(res => res.data),
  getUser: (id) => client(`/user/${id}`).then(res => res.data)
};