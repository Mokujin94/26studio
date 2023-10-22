import { $authHost, $host } from './index';

export const createGroups = async (name) => {
  const { data } = await $host.post('api/group', { name });
  return data;
};

export const fetchGroups = async () => {
  const { data } = await $host.get('api/group');
  return data;
};

export const fetchGroupById = async (id) => {
  const { data } = await $host.get('api/group/' + id);
  return data;
};
