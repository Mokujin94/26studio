import { $authHost, $host, $adminHost } from "./index";

export const fetchProject = async (pathFromProject, baseURL) => {
	const config = {
		params: {
			filePath: pathFromProject,
		},
	};
	const { data } = await $host.get("/api/user/accept_project", config);
	let pathWithForwardSlashes = baseURL.replace(/\\/g, "/");
	const correctedPath = pathWithForwardSlashes.replace(/^https:\//, "https://");
	// const correctedPath = pathWithForwardSlashes.replace(/^http:\//, "http://");
	// // Преобразуем относительные пути в абсолютные
	const transformedContent = data.replace(
		/(<head>)/,
		(match, p1) => p1 + `<base href="${correctedPath}">`
	);

	const updatedLinks = transformedContent.replace(
		/(<link\s+.*?href=")(.*?)(".*?>)/g,
		(match, p1, p2, p3) => p1 + p2 + p3
	);

	return updatedLinks;
};

export const uploadFinishedProject = async (project) => {
	const { data } = await $authHost.post(
		"api/user/upload_finished_project",
		project
	);
	return data;
};

export const getAll = async (filter, page) => {
	const config = {
		params: {
			page,
			filter,
		},
	};
	const { data } = await $host.get("api/project", config);
	return data;
};

export const fetchProjectById = async (id) => {
	const { data } = await $host.get("api/project/" + id);
	return data;
};

export const deleteProjectById = async (id) => {
	const { data } = await $authHost.delete("api/project/" + id);
	return data;
};

export const condidate = async (projectId, userId) => {
	const config = {
		params: {
			projectId,
			userId,
		},
	};
	const { data } = await $host.get("api/project/condidate", config);
	return data;
};

export const like = async (projectId, userId) => {
	const { data } = await $authHost.post("api/project/like", {
		projectId,
		userId,
	});
	return data;
};

export const deleteLike = async (projectId, userId) => {
	const config = {
		params: {
			projectId,
			userId,
		},
	};
	const { data } = await $authHost.patch("api/project/like", {
		projectId,
		userId,
	});
	return data;
};

export const fetchAllLikes = async () => {
	const { data } = await $host.get("api/project/likes");
	return data;
};

export const fetchLikes = async (id) => {
	const { data } = await $host.get("api/project/" + id + "/likes");
	return data;
};

export const fetchProjectsUser = async (id) => {
	const { data } = await $host.get("api/project/user/" + id);
	return data;
};

export const searchProject = async (search, filter, page) => {
	const config = {
		params: {
			search,
			filter,
			page,
		},
	};
	const { data } = await $host.get("api/project/search/", config);
	return data;
};
