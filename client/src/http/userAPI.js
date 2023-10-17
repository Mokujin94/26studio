import { $authHost, $host } from "./index";
import jwt_decode from "jwt-decode";

export const checkCondidate = async (name, email) => {
  const { data } = await $host.post("api/user/registration/condidate", {
    name,
    email,
  });
  return data;
};

export const registration = async (user) => {
  const { data } = await $host.post("api/user/registration", user);
  return jwt_decode(data.token);
};

export const login = async (
  name,
  full_name,
  email,
  password,
  groupId,
  roleId
) => {
  const { data } = await $host.post("api/user/registration", {
    name,
    full_name,
    email,
    password,
    groupId,
    roleId,
  });
  return jwt_decode(data.token);
};

export const check = async () => {
  const response = await $host.post("api/auth/registration");
  return response;
};
