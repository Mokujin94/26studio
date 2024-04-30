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

	const { data } = await $authHost.post('api/messenger/', { otherUserId, userId });
	return data;
};
