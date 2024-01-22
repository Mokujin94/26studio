import { $authHost, $host } from "./index";

export const addFriend = async (id, id_recipient) => {
  const { data } = await $authHost.post("api/friend", { id, id_recipient });
  return data;
};

export const addSubscriber = async (id, id_recipient) => {
  const { data } = await $authHost.post("api/friend/subscriber", { id, id_recipient });
  return data;
};

export const fetchFriendsSubscriber = async (id) => {
  const config = {
    params: {
      userId: id,
    },
  };
  const { data } = await $host.get("api/friend/subscriber", config);
  return data;
};

export const fetchFriends = async (id) => {
  const config = {
    params: {
      userId: id
    },
  };
  const { data } = await $host.get("api/friend/", config);
  return data;
};


export const deleteFriend = async (id, id_recipient) => {
  const config = {
    params: {
      id,
      id_recipient
    },
  };
  const { data } = await $authHost.delete("api/friend/", config);
  return data;
};

export const deleteSubscriber = async (id, id_recipient) => {
  const config = {
    params: {
      id,
      id_recipient
    },
  };
  const { data } = await $authHost.delete("api/friend/subscriber", config);
  return data;
};
