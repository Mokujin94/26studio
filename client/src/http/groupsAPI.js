import { $adminHost, $authHost, $host } from "./index";

export const createGroups = async (name) => {
  const { data } = await $adminHost.post("api/group", { name });
  return data;
};

export const fetchGroups = async () => {
  const { data } = await $host.get("api/group");
  return data;
};

export const fetchGroupById = async (id) => {
  const { data } = await $host.get("api/group/" + id);
  return data;
};

export const fetchAddStudent = async (id, id_user) => {
  const { data } = await $adminHost.patch("api/group/" + id + "/add", {
    id_user,
  });
  return data;
};

export const fetchDeleteStudent = async (id, id_user) => {
  const { data } = await $adminHost.patch("api/group/" + id + "/delete", {
    id_user,
  });
  return data;
};
