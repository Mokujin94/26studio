import { $authHost, $host } from './index';

export const createNews = async (news) => {
	const { data } = await $authHost.post('api/news', news);
	return data;
};

export const fetchNews = async () => {
	const { data } = await $host.get('api/news');
	return data;
};

export const fetchNewsById = async (id) => {
	const { data } = await $host.get('api/news/' + id);
	return data;
};

export const condidate = async (newsId, userId) => {
	const config = {
		params: {
			newsId,
			userId,
		},
	};
	const { data } = await $host.get('api/news/condidate', config);
	return data;
};

export const like = async (newsId, userId) => {
	const { data } = await $authHost.post('api/news/like', {
		newsId,
		userId,
	});
	return data;
};

export const deleteLike = async (newsId, userId) => {
	const config = {
		params: {
			newsId,
			userId,
		},
	};
	const { data } = await $authHost.delete('api/news/delete', config);
	return data;
};


export const uploadPhoto = async (photo) => {
	const { data } = await $authHost.post('api/news/upload_photo', photo);
	return data;
}