import { $authHost, $host } from "./index";

export const createProject = async (message, projectId, resendId) => {
  const { data } = await $host.post("api/comment/project", {
    message,
    projectId,
    resendId,
  });
  return data;
};

export const createNews = async (message, newsId, resendId) => {
  const { data } = await $host.post("api/comment/news", {
    message,
    newsId,
    resendId,
  });
  return data;
};

export const getAllCommentsProject = async (id) => {
  const { data } = await $host.get("api/comment/project/" + id);
  return data;
};

export const getAllCommentsNews = async () => {
  const { data } = await $host.get("api/comment/news");
  return data;
};
