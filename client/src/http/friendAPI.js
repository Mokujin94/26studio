import { $authHost, $host } from "./index";

export const friendRequest = async (userId, friendId) => {
  const { data } = await $authHost.post("api/friend/", {userId, friendId});
  return data;
};

export const friendAccept = async (userId, friendId) => {
  const { data } = await $authHost.patch("api/friend/", {userId, friendId});
  return data;
};

export const friendDelete = async (userId, friendId) => {
  const config = {
    params: {
      userId,
      friendId
    }
  }
  const { data } = await $authHost.delete("api/friend/", config);
  return data;
};

export const getRequestFriends = async (userId) => {
  const config = {
    params: {
      userId,
    }
  }
  const { data } = await $authHost.get("api/friend/requests", config);
  return data;
};

export const getFriends = async (userId) => {
  const config = {
    params: {
      userId,
    }
  }
  const { data } = await $authHost.get("api/friend/friends", config);
  return data;
};