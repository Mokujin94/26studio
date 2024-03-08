const { where } = require("sequelize");
const ApiError = require("../error/ApiError");
const {
	Comments,
	Project,
	News,
	User,
	Notifications,
	Likes,
} = require("../models/models");
const { getIo } = require("../socket");

class CommentController {
	async getAllCommentsProject(req, res, next) {
		try {
			const { id } = req.params;

			const comments = await Project.findAll({
				include: [
					{
						model: Comments,
						include: [User, {
							model: Comments,
							as: 'replyes',
							include: [User, {
								model: User,
								as: "userReply"
							}, Likes]
						}, Likes],
					},
				],
				where: {
					id,
				},
			});

			return res.json(comments);
		} catch (error) {
			next(ApiError.badRequest(error.message));
		}
	}

	async getAllCommentsNews(req, res, next) {
		try {
			const { id } = req.params;

			const comments = await News.findAll({
				include: [
					{
						model: Comments,
						include: [User, {
							model: Comments,
							as: 'replyes',
							include: [User, {
								model: User,
								as: "userReply"
							}, Likes]
						}, Likes],
					},
				],
				where: {
					id,
				},
			});

			return res.json(comments);
		} catch (error) {
			next(ApiError.badRequest(error.message));
		}
	}

	async createCommentProject(req, res, next) {
		try {
			const { message, projectId, resendId, userId } = req.body;
			const io = getIo();

			if (!userId) {
				return next(ApiError.internal("Вы не авторизованы"));
			}

			const comment = await Comments.create({
				message,
				projectId,
				resendId,
				userId,
			});

			const savedComment = await Comments.findOne({
				where: { id: comment.id },
				include: [
					User,
					{
						model: Comments,
						as: 'replyes',
						include: [User, {
							model: User,
							as: "userReply"
						}, Likes]
					},
					{
						model: Project,
						include: [User],
					},
					Likes
				],
			});

			const notification = await Notifications.create({
				commentId: comment.id,
				senderId: userId,
				recipientId: savedComment.project.user.id,
			});

			const sendNotification = await Notifications.findOne({
				where: { id: notification.id },
				include: [
					{
						model: Comments,
						as: "comment",
					},
					{
						model: Comments,
						as: "replyComment",
					},
					{
						model: Likes,
						as: "like",
					},
					{
						model: User,
						as: "sender",
					},
					{
						model: User,
						as: "recipient",
					},
				],
			});
			io.emit("notification", sendNotification);

			io.emit("sendCommentsToClients", savedComment);
			return res.json(savedComment);
		} catch (error) {
			next(ApiError.badRequest(error.message));
		}
	}

	async createCommentNews(req, res, next) {
		try {
			const { message, newsId, resendId, userId } = req.body;
			const io = getIo();

			if (!userId) {
				return next(ApiError.internal("Вы не авторизованы"));
			}

			const comment = await Comments.create({
				message,
				newsId,
				resendId,
				userId,
			});

			const savedComment = await Comments.findOne({
				where: { id: comment.id },
				include: [
					User,
					{
						model: Comments,
						as: 'replyes',
						include: [User, {
							model: User,
							as: "userReply"
						}, Likes]
					},
					{
						model: News,
						include: [User],
					},
					Likes
				],
			});

			const notification = await Notifications.create({
				commentId: comment.id,
				senderId: userId,
				recipientId: savedComment.news.user.id,
			});

			const sendNotification = await Notifications.findOne({
				where: { id: notification.id },
				include: [
					{
						model: Comments,
						as: "comment",
					},
					{
						model: Comments,
						as: "replyComment",
					},
					{
						model: Likes,
						as: "like",
					},
					{
						model: User,
						as: "sender",
					},
					{
						model: User,
						as: "recipient",
					},
				],
			});
			io.emit("notification", sendNotification);

			io.emit("sendCommentsNewsToClients", savedComment);
			return res.json(savedComment);
		} catch (error) {
			next(ApiError.badRequest(error.message));
		}
	}

	async createChildComment(req, res, next) {
		const { message, userId, parentId, replyUser } = req.body;
		const io = getIo();

		if (!userId) {
			return next(ApiError.internal("Вы не авторизованы"));
		}

		try {
			const comment = await Comments.create({
				message,
				userId,
				parentId,
				replyUserId: replyUser
			});

			const notification = await Notifications.create({
				replyCommentId: comment.id,
				senderId: userId,
				recipientId: comment.replyUserId,
			});

			const sendNotification = await Notifications.findOne({
				where: { id: notification.id },
				include: [
					{
						model: Comments,
						as: "comment",
					},
					{
						model: Comments,
						as: "replyComment",
					},
					{
						model: Likes,
						as: "like",
					},
					{
						model: User,
						as: "sender",
					},
					{
						model: User,
						as: "recipient",
					},
				],
			});
			io.emit("notification", sendNotification);
			const savedComment = await Comments.findOne({
				where: { id: comment.id },
				include: [{
					model: User,
					attributes: ["id", "name", "avatar"],
				}, {
					model: User,
					as: "userReply"
				}, Likes],

			});

			io.emit("replyComment", savedComment);
			return res.json(comment);
		} catch (error) {
			next(ApiError.badRequest(error.message))
		}

	}

	async createLike(req, res, next) {
		const { commentId, userId } = req.body;

		let likeData;

		try {

			if (!userId) {
				return next(ApiError.internal("Вы не авторизованы"));
			}

			likeData = await Likes.findOne({
				where: { commentId, userId }
			})

			if (likeData) {
				if (likeData.status) {
					return next(ApiError.badRequest("Лайк уже стоит"))
				}
				await likeData.update({ status: true })
			} else {
				likeData = await Likes.create({ commentId, userId })
			}


			return await res.json(likeData);
		} catch (error) {
			next(ApiError.badRequest(error.message))
		}
	}

	async deleteLike(req, res, next) {
		const { commentId, userId } = req.body;

		let likeData;

		try {

			if (!userId) {
				return next(ApiError.internal("Вы не авторизованы"));
			}

			likeData = await Likes.findOne({
				where: { commentId, userId }
			})

			if (!likeData.status) {
				return next(ApiError.badRequest("Нельзя поставить дизлайк"))
			}

			await likeData.update({ status: false });

			return await res.json(likeData);
		} catch (error) {
			next(ApiError.badRequest(error.message))
		}
	}
}

module.exports = new CommentController();
