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

export const sendMessage = async (otherUserId, userId, text, files = []) => {
        const formData = new FormData();
        formData.append('otherUserId', otherUserId);
        formData.append('userId', userId);
        formData.append('text', text);
        if (files.length) {
                files.forEach(file => {
                        formData.append('files', file);
                });
        }

        const { data } = await $host.post('api/messenger/sendMessage', formData);
        return data;
};


export const onReadMessage = async (userId, messageId) => {

	const { data } = await $host.post('api/messenger/readMessage', { userId, messageId });
	return data;
};

export const fetchMessages = async (chatId, groupMessages) => {
	const config = {
		params: {
			chatId,
			groupMessages
		}
	}
	const { data } = await $host.get('api/messenger/getMessages', config);
	return data;
};