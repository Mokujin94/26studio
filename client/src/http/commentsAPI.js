import axios from "axios";
import { $authHost, $host } from "./index";

const source = axios.CancelToken.source();

export const createProject = async (message, projectId, userId, resendId) => {
    const { data } = await $authHost.post("api/comment/project", {
        message,
        projectId,
        userId,
        resendId,
    });
    return data;
};

export const createNews = async (message, newsId, userId, resendId) => {
    const { data } = await $authHost.post("api/comment/news", {
        message,
        newsId,
        userId,
        resendId,
    });
    return data;
};

export const createReply = async (message, userId, parentId, parentUserId, replyUser, projectId) => {
    const { data } = await $authHost.post("api/comment/reply", {
        message,
        userId,
        parentId,
        parentUserId,
        replyUser,
        projectId
    });
    return data;
};

export const like = async (commentId, userId) => {
    // Отменить предыдущий запрос, если он существует
    if (source) {
        source.cancel("Отмена предыдущего запроса");
    }

    // Создание нового экземпляра Cancel Token
    const cancelTokenSource = axios.CancelToken.source();

    try {
        // Отправка запроса с использованием нового Cancel Token
        const { data } = await $authHost.post(
            "api/comment/like/",
            { commentId, userId },
            { cancelToken: cancelTokenSource.token }
        );
        return data;
    } catch (error) {
        if (axios.isCancel(error)) {

        } else {
            console.error('Ошибка:', error);
        }
    }
};

export const deleteLike = async (commentId, userId) => {
    // Отменить предыдущий запрос, если он существует
    if (source) {
        source.cancel("Отмена предыдущего запроса");
    }

    // Создание нового экземпляра Cancel Token
    const cancelTokenSource = axios.CancelToken.source();

    try {
        // Отправка запроса DELETE с использованием нового Cancel Token
        const { data } = await $authHost.patch(
            "api/comment/deleteLike/",
            { commentId, userId },
            { cancelToken: cancelTokenSource.token }
        );
        return data;
    } catch (error) {
        if (axios.isCancel(error)) {

        } else {
            console.error('Ошибка:', error);
        }
    }
};

export const getAllCommentsProject = async (id) => {
    const { data } = await $host.get("api/comment/project/" + id);
    return data;
};

export const getAllCommentsNews = async (id) => {
    const { data } = await $host.get("api/comment/news/" + id);
    return data;
};


