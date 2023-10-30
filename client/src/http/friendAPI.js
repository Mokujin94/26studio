import { $authHost, $host } from './index';

export const addFriend = async (id, id_recipient) => {
  const { data } = await $host.post('api/friend', {id, id_recipient});
  return data;
};

export const fetchFriends = async (id) => {
    const config = {
      params: {
        userId: id
      }
    }
    const { data } = await $host.get("api/friend", config);
    return data;
  };

