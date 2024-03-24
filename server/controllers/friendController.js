const { Op } = require("sequelize");
const {
	Friend,
	Subscriber,
	User,
	Likes,
	Comments,
	Notifications,
	UserFriend,
} = require("../models/models");
const ApiError = require("../error/ApiError");
const { getIo } = require("../socket");

class FriendController {
	async getFriends(req, res, next) {
		try {
			const { userId } = req.query;

			const friends = User.findOne({
				where: { id: userId },
				include: [
					{
						model: Friend,
						through: UserFriend,
						as: "friends",
					},
				],
			});

			return res.json(friends);
		} catch (error) {
			next(ApiError.badRequest(error));
		}
	}

	async getRequestFriends(req, res, next) {
		try {
			const { userId } = req.query;

			const friends = User.findOne({
				where: { id: userId },
				include: [
					{
						model: Friend,
						through: UserFriend,
						as: "friends",
					},
				],
			});

			return res.json(friends);
		} catch (error) {
			next(ApiError.badRequest(error));
		}
	}

	async friendRequest(req, res, next) {
		try {
			const { userId, friendId } = req.body;

			const io = getIo();

			const friend = await Friend.create({
				userId,
				friendId,
				status: false
			});

			await UserFriend.create({
				userId,
				friendId: friend.id,
			});

			await UserFriend.create({
				userId: friendId,
				friendId: friend.id,
			});

			const notification = await Notifications.create({
				senderId: userId,
				recipientId: friendId,
				friend_status: false,
			});

			const sendNotification = await Notifications.findOne({
				where: { id: notification.id },
				include: [
					{
						model: Likes,
						as: "like",
					},
					{
						model: Comments,
						as: "comment",
					},
					{
						model: Comments,
						as: "replyComment",
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



			return res.json(friend);
		} catch (error) {
			next(ApiError.badRequest(error));
		}
	}

	async friendAccept(req, res, next) {
		try {
			const { userId, friendId } = req.body;

			const io = getIo();

			const friend = await Friend.findOne({
				where: { userId, friendId, status: false },
			});

			if (!friend) {
				next(ApiError.forbidden(userId));
			}

			await friend.update({
				status: true,
			});

			const notification = await Notifications.create({
				senderId: friendId,
				recipientId: userId,
				friend_status: true,
			});

			const sendNotification = await Notifications.findOne({
				where: { id: notification.id },
				include: [
					{
						model: Likes,
						as: "like",
					},
					{
						model: Comments,
						as: "comment",
					},
					{
						model: Comments,
						as: "replyComment",
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

			return res.json(friend);
		} catch (error) {
			next(ApiError.badRequest(error));
		}
	}

	async deleteFriend(req, res, next) {
		try {
			const { userId, friendId } = req.query;

			const friend = Friend.destroy({
				where: {
					[Op.or]: [
						{ userId: userId, friendId: friendId },
						{ userId: friendId, friendId: userId },
					],
				},
			});

			if (!friend) {
				next(ApiError.forbidden("Вы не являетесь друзьями"));
			}

			return res.json(friend);
		} catch (error) {
			next(ApiError.badRequest(error));
		}
	}
}

module.exports = new FriendController();
