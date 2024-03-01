import { $authHost, $host } from "./index";
import jwt_decode from "jwt-decode";

export const checkCondidate = async (name, email) => {
	const { data } = await $host.post("api/user/registration/condidate", {
		name,
		email,
	});
	return data;
};

export const registration = async (user) => {
	const { data } = await $host.post("api/user/registration", user);
	localStorage.setItem("token", data.token);
	return jwt_decode(data.token);
};

export const login = async (email, password) => {
	const { data } = await $host.post("api/user/login", {
		email,
		password,
	});
	localStorage.setItem("token", data.token);
	return jwt_decode(data.token);
};

export const check = async () => {
	const { data } = await $authHost.get("api/user/auth");
	localStorage.setItem("token", data.token);
	return jwt_decode(data.token);
};

export const fetchUserById = async (id) => {
	const { data } = await $authHost.get("api/user/" + id);
	return data;
};

export const fetchUserByEmail = async (email) => {
	const config = {
		params: {
			email
		},
	};
	const { data } = await $host.get("api/user/login/recovery", config);
	return data;
};

export const recoveryPassword = async (email, new_password) => {
	const { data } = await $host.patch("api/user/login/recovery", { email, new_password });
	return data;
};

export const fetchOneUser = async (id) => {
	const { data } = await $host.get("api/user/" + id);
	return data;
};

export const fetchAllUsers = async (id) => {
	const config = {
		params: {
			groupId: id,
		},
	};
	const { data } = await $host.get("api/user/all", config);
	return data;
};

export const searchUsersOnGroup = async (search, groupId, group_status) => {
	const config = {
		params: {
			search,
			groupId,
			group_status,
		},
	};
	const { data } = await $host.get("api/user/search/groups", config);
	return data;
};

export const fetchUsersByGroupStatus = async (groupId, group_status) => {
	const config = {
		params: {
			groupId,
			group_status,
		},
	};
	const { data } = await $host.get("api/user/group_manage", config);
	return data;
};

export const fetchAllTutors = async () => {
	const { data } = await $host.get("api/user/tutors");
	return data;
};

export const generateCode = async (email, code) => {
	const { data } = await $host.post("api/user/code", { email, code });
	return data;
};

export const uploadProject = async (file) => {
	const { data } = await $authHost.post("api/user/upload_project", file);
	return data;
};

export const updateAvatar = async (avatar) => {
	const { data } = await $authHost.patch("api/user/avatar", avatar);
	localStorage.setItem("token", data.token);
	return jwt_decode(data.token);
};

export const updateUser = async (id, user) => {
	const { data } = await $authHost.patch("api/user/update/" + id, user);
	localStorage.setItem("token", data.token);
	return jwt_decode(data.token);
};