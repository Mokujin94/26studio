import { $authHost, $host, $adminHost } from "./index";

export const viewProject = async (projectId, userId) => {
  const { data } = await $authHost.post("api/view/project", {
    projectId,
    userId,
  });
  return data;
};

export const viewNews = async (newsId, userId) => {
  const { data } = await $authHost.post("api/view/news", {
    newsId,
    userId,
  });
  return data;
};
