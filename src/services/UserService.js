import axios from "./customizeAxios";

const fetchAllUsers = (page) => {
  return axios.get(`/api/users?page=${page}`);
};

const postCreateUser = (email, firstname, lastname) => {
  return axios.post(`/api/users`, { email, firstname, lastname });
};

const putEditUser = (id, firstname, lastname) => {
  return axios.put(`/api/users/${id}`, { firstname, lastname });
};

const deleteUser = (id) => {
  return axios.delete(`/api/users/${id}`);
};
export { fetchAllUsers, postCreateUser, putEditUser, deleteUser };
