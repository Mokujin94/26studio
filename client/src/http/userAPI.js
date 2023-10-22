import { $authHost, $host } from './index';
import jwt_decode from 'jwt-decode';

export const checkCondidate = async (name, email) => {
  const { data } = await $host.post('api/user/registration/condidate', {
    name,
    email,
  });
  return data;
};

export const registration = async (user) => {
  const { data } = await $host.post('api/user/registration', user);
  localStorage.setItem('token', data.token);
  return jwt_decode(data.token);
};

export const login = async (email, password) => {
  const { data } = await $host.post('api/user/login', {
    email,
    password,
  });
  localStorage.setItem('token', data.token);
  return jwt_decode(data.token);
};

export const check = async () => {
  const { data } = await $authHost.get('api/user/auth');
  localStorage.setItem('token', data.token);
  return jwt_decode(data.token);
};

export const fetchUserById = async (id) => {
  const { data } = await $authHost.get('api/user/' + id);
  return data;
};
