import { $authHost, $host } from './index';

export const createNews = async (title, descr, img) => {
  const { data } = await $host.post('api/news', { title, descr, img });
  return data;
};

export const fetchNews = async () => {
  const { data } = await $host.get('api/news');
  return data;
};
