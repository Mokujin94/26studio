import axios from "axios";
import { $authHost, $host } from "./index";

export const getAllDrafts = async (id) => {
    const { data } = await $authHost.get("api/draft/" + id);
    return data;
};

export const checkDraft = async (userId, chatId, text) => {
	const { data } = await $authHost.post("api/draft/", { userId, chatId, text });
	return data;
};
