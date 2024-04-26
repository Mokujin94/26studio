import axios from "axios";
import { $authHost, $host } from "./index";

export const fetchChat = async (id) => {
	const { data } = await $host.get("api/chat/" + id);
	return data;
};

export const sendMessage = async (content, userId, chatId) => {
	const { data } = await $host.post("api/chat/" + chatId, {content, userId});
	return data;
};

export const fetchMessages = async (userId, chatId) => {
	const config = {
		params: {
			userId
		}
	}

	const { data } = await $host.get("api/chat/messages/" + chatId, config);
	return data;
};