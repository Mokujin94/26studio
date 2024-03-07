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
							}]
						}],
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
							as: 'parent',
							include: User
						}],
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
						model: Project,
						include: [User],
					},
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

			const comment = await Comments.create({
				message,
				newsId,
				resendId,
				userId,
			});

			const savedComment = await Comments.findOne({
				where: { id: comment.id },
				include: [
					{
						model: User,
						attributes: ["id", "name", "avatar"],
					},
				],
			});

			const io = getIo();
			io.emit("sendCommentsNewsToClients", savedComment);
			return res.json(comment);
		} catch (error) {
			next(ApiError.badRequest(error.message));
		}
	}

	async createChildComment(req, res, next) {
		const { message, userId, parentId, replyUser, projectId } = req.body;
		const io = getIo();

		if (!userId) {
			return next(ApiError.internal("Вы не авторизованы"));
		}

		try {
			const comment = await Comments.create({
				message,
				userId,
				parentId,
				replyUserId: replyUser,
				projectId
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
				}],

			});

			io.emit("replyComment", savedComment);
			return res.json(comment);
		} catch (error) {
			next(ApiError.badRequest(error.message))
		}

	}
}

module.exports = new CommentController();
