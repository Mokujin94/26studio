import axios from "axios";
import jwt_decode from "jwt-decode";
import socketIOClient from "socket.io-client";

const $host = axios.create({
	baseURL: process.env.REACT_APP_API_URL,
});

const $authHost = axios.create({
	baseURL: process.env.REACT_APP_API_URL,
});

const $checkOnlineHost = axios.create({
	baseURL: process.env.REACT_APP_API_URL,
});

const $adminHost = axios.create({
	baseURL: process.env.REACT_APP_API_URL,
});

const authInterceptor = async (config) => {
	const token = localStorage.getItem("token");

	if (token) {

		config.headers.authorization = `Bearer ${token}`;
		const decode = jwt_decode(token);
		try {
			await getUserOnline(decode.id)
		} catch (error) {
			throw error
		}
	}

	return config;
};

const hostInterceptor = async (config) => {
	const token = localStorage.getItem("token");
	const currentDateUnix = new Date().getTime() / 1000;
	// 
	if (token) {
		const decode = await jwt_decode(token);
		if (currentDateUnix > decode.exp) return config;
		try {
			getUserOnline(decode.id)
		} catch (error) {
			throw error
		}
	}

	return config;
};


const getUserOnline = async (id) => {
	try {

		await $checkOnlineHost.patch('api/user/' + id);

	} catch (error) {
		throw error
	}
}

const getUserRoleFromAPI = async () => {
	try {
		// Здесь делаете запрос к API для получения роли пользователя
		const { data } = await $authHost.get("api/user/auth");
		const decode = jwt_decode(data.token);
		return decode.roleId; // Предполагается, что роль находится в свойстве 'role'
	} catch (error) {
		console.error("Ошибка при получении роли пользователя:", error);
		throw error;
	}
};

const adminInterceptor = async (config) => {
	const token = localStorage.getItem("token");

	if (token) {
		// Если токен есть, добавляем его в заголовки
		config.headers.authorization = `Bearer ${token}`;

		try {
			// Получаем роль пользователя из API
			const userRole = await getUserRoleFromAPI();

			// Добавляем роль в заголовки (здесь предполагается, что API ожидает заголовок 'UserRole')
			if (userRole === 1) {
				config.headers["UserRole"] = userRole;
			}

			return config;
		} catch (error) {
			console.error("Ошибка при получении роли пользователя:", error);
			throw error;
		}
	}
};

$authHost.interceptors.request.use(authInterceptor);
$host.interceptors.request.use(hostInterceptor);
$adminHost.interceptors.request.use(adminInterceptor);

export { $host, $authHost, $adminHost, };
