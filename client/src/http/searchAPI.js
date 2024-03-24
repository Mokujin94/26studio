import { $authHost, $host } from "./index";

export const searchAll = async (search) => {
    const config = {
      params: {
        search,
      },
    };
    const { data } = await $host.get("api/search/", config);
    return data;
  };