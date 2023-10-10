import { $authHost, $host } from "./index";

export const registration = async (name, email, password) => {
  const response = await $host.post("api/user/registration", {
    name,
    email,
    password,
    role: "STUDENT",
  });
  return response;
};

export const login = async (name, email, password) => {
  const response = await $host.post("api/user/registration", {
    name,
    email,
    password,
  });
  return response;
};

export const check = async () => {
  const response = await $host.post("api/user/registration");
  return response;
};
