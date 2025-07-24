import { $authHost, $host } from "./index";

export const fetchNotifications = async (recipientId) => {
  const config = {
    params: {
      recipientId,
    },
  };
  const { data } = await $authHost.get("api/notification", config);
  return data;
};

export const updateViewNotifications = async (recipientId) => {
  const { data } = await $authHost.patch("api/notification", { recipientId });
  return data;
};

export const deleteNotification = async (id) => {
  const { data } = await $authHost.delete("api/notification/" + id);
  return data;
};

export const deleteAllNotification = async (userId) => {
  const config = {
    params: {
      userId,
    },
  };
  const { data } = await $authHost.delete("api/notification/", config);
  return data;
};
