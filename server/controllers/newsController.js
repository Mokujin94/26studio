const {
	News,
	Likes,
	Comments,
	User,
	View,
	Project,
} = require("../models/models");
const fs = require('fs');
const uuid = require("uuid");
const path = require("path");
const ApiError = require("../error/ApiError");
const { getIo } = require("../socket");

class NewsController {
	async create(req, res, next) {
		try {
			const { title, description, userId } = req.body;
			const { img } = req.files;

			if (!title || !description || !userId || !img) {
				return next(ApiError.badRequest('Заполните все поля'))
			}

			let fileName = uuid.v4() + ".jpg";
			const staticNews = path.join(__dirname, "..", "static", "news");

			if (!fs.existsSync(staticNews)) {
				fs.mkdirSync(staticNews);
			}
			img.mv(path.resolve(__dirname, "..", "static/news", fileName));
			const news = await News.create({ title, description, img: fileName, userId });
			return res.json(news);
		} catch (e) {
			next(ApiError.badRequest(e.message));
		}
	}

	async getAll(req, res, next) {
		try {
			let { limit, page } = req.query;
			page = page || 1;
			limit = limit || 12;
			let offset = page * limit - limit;

			let news = await News.findAndCountAll({
				include: [Comments, Likes, View, User],
				limit,
				offset,
				where: {
					isProposed: false,
				},
			});
			return res.json(news);
		} catch (error) {
			next(ApiError.badRequest(error.message));
		}
	}

	async getAllProposed(req, res, next) {
		try {
			let { limit, page } = req.query;
			page = page || 1;
			limit = limit || 12;
			let offset = page * limit - limit;

			let news = await News.findAndCountAll({
				include: [Comments, Likes, View],
				limit,
				offset,
				where: {
					isProposed: true,
				},
			});
			return res.json(news);
		} catch (error) {
			next(ApiError.badRequest(error.message));
		}
	}

	async getOne(req, res, next) {
		try {
			const { id } = req.params;
			const news = await News.findOne({
				where: { id },
				include: [Comments, Likes, View, User],
			});
			return res.json(news);
		} catch (error) {
			next(ApiError.badRequest(error.message));
		}
	}

	async condidateLike(req, res, next) {
		try {
			const { newsId, userId } = req.query;

			if (!userId) {
				return next(ApiError.internal("Не авторизован"));
			}

			const condidate = await Likes.findAll({
				where: { userId, newsId },
			});

			return res.json(condidate);
		} catch (error) {
			next(ApiError.badRequest(error.message));
		}
	}

	async setLike(req, res, next) {
		try {
			const { newsId, userId } = req.body;

			if (!userId) {
				return next(ApiError.internal("Не авторизован"));
			}

			const likes = await Likes.create({
				newsId,
				userId,
			});

			const newLikes = await Likes.findOne({
				include: [User, Project],
				where: { id: likes.id },
			});

			const allLikes = await News.findAll({
				include: [Likes, Comments, View],
				where: { id: newsId },
			});
			const io = getIo();
			io.emit("sendLikesToClients", allLikes);
			// io.emit("notification", {newLikes, flag: "like"});
			return res.json(likes);
		} catch (error) {
			next(ApiError.badRequest(error.message));
		}
	}

	async deleteLike(req, res, next) {
		try {
			const { newsId, userId } = req.query;
			if (!userId) {
				return next(ApiError.internal("Не авторизован"));
			}
			const likes = await Likes.destroy({
				where: { newsId, userId },
			});

			const allLikes = await News.findAll({
				include: [Likes, Comments, View],
				where: { id: newsId },
			});
			const io = getIo();
			io.emit("sendLikesNewsToClients", allLikes);
			return res.json(likes);
		} catch (error) {
			next(ApiError.badRequest(error.message));
		}
	}

	async uploadPhoto(req, res, next) {
		const { img } = req.files;
		let fileName;
		try {

			fileName = uuid.v4() + ".jpg";
			img.mv(path.resolve(__dirname, "..", "static/news", fileName));

			return res.json(fileName);

		} catch (error) {
			next(ApiError.badRequest(error.message));
		}
	}
}

module.exports = new NewsController();
