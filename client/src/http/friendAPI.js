import { $authHost, $host } from "./index";

export const addFriend = async (id_sender, id_recipient) => {
  const { data } = await $authHost.patch("api/friend/", {
    id_sender,
    id_recipient,
  });
  return data;
};

export const reqFriend = async (id_sender, id_recipient) => {
  const { data } = await $authHost.post("api/friend/", {
    id_sender,
    id_recipient,
  });
  return data;
};

export const deleteFriend = async (id_sender, id_recipient) => {
  const config = {
    params: {
      id_sender,
      id_recipient,
    },
  };
  const { data } = await $authHost.delete("api/friend/", config);
  return data;
};

export const getFriends = async (userId, status) => {
  const config = {
    params: {
      userId,
      status
    },
  };
  const { data } = await $host.get("api/friend/", config);
  return data;
};

export const getRequestFriends = async (userId) => {
  const config = {
    params: {
      userId,
    },
  };
  const { data } = await $host.get("api/friend/request", config);
  return data;
};
