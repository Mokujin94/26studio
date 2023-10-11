import { $authHost, $host } from "./index";
import jwt_decode from "jwt-decode";

export const registration = async (name, email, password) => {
  const { data } = await $host.post("api/user/registration", {
    name,
    email,
    password,
    role: 1,
  });
  return jwt_decode(data.token);
};

export const login = async (name, email, password) => {
  const { data } = await $host.post("api/user/registration", {
    name,
    email,
    password,
  });
  return jwt_decode(data.token);
};

export const check = async () => {
  const response = await $host.post("api/auth/registration");
  return response;
};
