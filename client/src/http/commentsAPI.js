import { $authHost, $host } from "./index";

export const createProject = async (message, projectId, userId, resendId) => {
	const { data } = await $authHost.post("api/comment/project", {
		message,
		projectId,
		userId,
		resendId,
	});
	return data;
};

export const createNews = async (message, newsId, userId, resendId) => {
	const { data } = await $authHost.post("api/comment/news", {
		message,
		newsId,
		userId,
		resendId,
	});
	return data;
};

export const createReply = async (message, userId, parentId, replyUser) => {
	const { data } = await $authHost.post("api/comment/reply", {
		message,
		userId,
		parentId,
		replyUser
	});
	return data;
};

export const getAllCommentsProject = async (id) => {
	const { data } = await $host.get("api/comment/project/" + id);
	return data;
};

export const getAllCommentsNews = async (id) => {
	const { data } = await $host.get("api/comment/news/" + id);
	return data;
};
