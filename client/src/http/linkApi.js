import axios from "axios";
import { $authHost, $host } from "./index";

export const getLinkPreview = async (url) => {

	const config = {
		params: {
			url
		}
	}
	const { data } = await $host.get('api/link/preview', config);
	return data;
};

