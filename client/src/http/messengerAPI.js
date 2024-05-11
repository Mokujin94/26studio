import axios from "axios";
import { $authHost, $host } from "./index";

export const fetchAllChats = async (userId) => {

	const config = {
		params: {
			userId
		}
	}
	const { data } = await $authHost.get('api/messenger/chats', config);
	return data;
};

export const fetchPersonalChat = async (otherUserId, userId) => {
	const config = {
		params: {
			otherUserId,
			userId
		}
	}
	const { data } = await $authHost.get('api/messenger/', config);
	return data;
};

export const sendMessage = async (otherUserId, userId, text) => {

	const { data } = await $host.post('api/messenger/sendMessage', { otherUserId, userId, text });
	return data;
};


export const onReadMessage = async (userId, messageId) => {

	const { data } = await $host.post('api/messenger/readMessage', { userId, messageId });
	return data;
};