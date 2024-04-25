import axios from "axios";
import { $authHost, $host } from "./index";

export const fetchChat = async (id) => {
	const { data } = await $host.get("api/chat/" + id);
	return data;
};
