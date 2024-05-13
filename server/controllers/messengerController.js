const { Op, json, where, Sequelize } = require("sequelize");
const ApiError = require("../error/ApiError");
const { Chats, User, Messages, ChatMembers, ReadMessages } = require("../models/models");
const { sequelize } = require("../db");
const { getIo } = require("../socket");
require("dotenv").config();


class MessengerController {
	async getOnePersonal(req, res, next) {
		const { otherUserId, userId } = req.query;
		let chat;
		const user = await User.findOne({
			where: { id: otherUserId }
		})
		const user1ChatIds = await ChatMembers.findAll({
			where: { userId: otherUserId },
			attributes: ['chatId'],
			raw: true
		});
		const chatIds = user1ChatIds.map(cm => cm.chatId);
		// Теперь найдем чат, в котором участвуют оба пользователя
		const commonChat = await Chats.findOne({
			where: {
				id: { [Op.in]: chatIds }, // Фильтр по чату, где участвует первый пользователь
				is_group: false
			},
			include: [
				{
					model: User,
					as: 'members',
					where: { id: userId }, // Второй пользователь должен быть участником
					attributes: [],
					required: true
				},
				{
					model: Messages,
					as: "messages",
					include: User,
					order: [
						["createdAt", "DESC"]
					],
					limit: 50,
				}
			],
		});



		if (!commonChat) {
			chat = {
				is_group: false,
				member: user,
				messages: [],
				countMessages: 0
			}
		} else {
			chat = commonChat ? commonChat.get({ plain: true }) : {}; // Если нужно получить "чистый" объект
			chat.member = user; // Добавляем свойство
			const totalCountMessages = await Messages.count({
				where: {
					chatId: commonChat.id
				}
			});
			chat.countMessages = totalCountMessages
		}



		chat.messages.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))

		function isSameDay(date1, date2) {
			return date1.getDate() === date2.getDate() &&
				date1.getMonth() === date2.getMonth() &&
				date1.getFullYear() === date2.getFullYear() &&
				date1.getHours() === date2.getHours();
		}

		function groupMessagesByUser(messages) {
			return messages.reduce((acc, message) => {
				const lastGroup = acc[acc.length - 1];
				const messageDate = new Date(message.createdAt);

				if (!lastGroup || lastGroup[0].userId !== message.userId || !isSameDay(new Date(lastGroup[lastGroup.length - 1].createdAt), messageDate)) {
					acc.push([message]);
				} else {
					lastGroup.push(message);
				}
				return acc;
			}, []);
		}

		const groupedMessages = groupMessagesByUser(chat.messages);
		groupedMessages.map(item => item.sort((a, b) => a.id - b.id))
		chat.messages = groupedMessages
		return res.json(chat)

	}

	async getAllChats(req, res, next) {
		const { userId } = req.query;

		if (!userId) {
			return next(ApiError.badRequest("Не найдено"))
		}

		const userChats = await User.findOne({
			where: { id: userId },
			include: [
				{
					model: Chats,
					as: "chats", // Убедитесь, что правильный алиас
					through: {
						model: ChatMembers,
						attributes: []
					},
					include: [
						{
							model: User, // Включаем всех участников чата
							as: "members", // Или используйте подходящий алиас
							through: { attributes: [] }, // Можно не включать атрибуты связующей таблицы
						},
						{
							model: Messages,
							as: "messages",
							order: [
								["createdAt", "DESC"]
							],
							limit: 1 // Получаем последние сообщения, если нужно
						},
						{
							model: Messages,
							as: "notReadMessages",
							where: { isRead: false, userId: { [Sequelize.Op.ne]: userId }, },
							required: false
						}
					]
				}
			]
		});

		return res.json(userChats)
	}



	async createMessages(req, res, next) {
		const { otherUserId, userId, text } = req.body;
		const io = getIo();
		let chat
		const user1ChatIds = await ChatMembers.findAll({
			where: { userId: otherUserId },
			attributes: ['chatId'],
			raw: true
		});
		const chatIds = user1ChatIds.map(cm => cm.chatId);
		// Теперь найдем чат, в котором участвуют оба пользователя
		chat = await Chats.findOne({
			where: {
				id: { [Op.in]: chatIds }, // Фильтр по чату, где участвует первый пользователь
				is_group: false
			},
			include: [
				{
					model: User,
					as: 'members',
					where: { id: userId }, // Второй пользователь должен быть участником
					attributes: [],
					required: true
				},
				{
					model: Messages,
					as: "messages",
				}
			],
		});

		if (!chat) {
			chat = await Chats.create({
				name: `chatPersonal${otherUserId}${userId}`
			})
			await ChatMembers.create({
				userId: otherUserId,
				chatId: chat.id
			})
			await ChatMembers.create({
				userId,
				chatId: chat.id
			})
		}

		const message = await Messages.create({
			userId,
			chatId: chat.id,
			text
		})
		const messageWithUser = await Messages.findByPk(message.id, {
			include: [
				{
					model: User,
					attributes: ['id', 'name', 'avatar'], // Укажите необходимые атрибуты
				},
			],
		});

		return res.json(messageWithUser)
	}

	async readMessage(req, res, next) {
		const { userId, messageId } = req.body;

		if (!messageId) return next(ApiError.badRequest("Не найдено сообщение"))

		const message = await Messages.findOne({
			where: { id: messageId }
		})

		if (message.userId === userId) {
			return res.status(200).json({ message: "Нельзя прочитать свое сообщение" });
		}
		await message.update(
			{ isRead: true }
		)



		const findReadMessage = await ReadMessages.findOne({
			where: { userId, messageId }
		})

		if (findReadMessage) {
			return res.status(200).json({ message: "Нельзя прочитать уже прочитанное сообщение" });
		}

		const readMessage = await ReadMessages.create({
			userId,
			messageId
		})

		return res.json(readMessage);
	}

	async getMessages(req, res, next) {
		const { chatId, groupMessages } = req.query;
		const limit = 50;
		let offset = groupMessages * limit - limit;
		const messages = await Messages.findAndCountAll({
			where: { chatId },
			include: User,
			order: [
				["createdAt", "DESC"]
			],
			limit,
			offset
		})


		messages.rows.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))

		function isSameDay(date1, date2) {
			return date1.getDate() === date2.getDate() &&
				date1.getMonth() === date2.getMonth() &&
				date1.getFullYear() === date2.getFullYear() &&
				date1.getHours() === date2.getHours();
		}

		function groupMessagesByUser(messages) {
			return messages.reduce((acc, message) => {
				const lastGroup = acc[acc.length - 1];
				const messageDate = new Date(message.createdAt);

				if (!lastGroup || lastGroup[0].userId !== message.userId || !isSameDay(new Date(lastGroup[lastGroup.length - 1].createdAt), messageDate)) {
					acc.push([message]);
				} else {
					lastGroup.push(message);
				}
				return acc;
			}, []);
		}

		const groupedMessages = groupMessagesByUser(messages.rows);
		groupedMessages.map(item => item.sort((a, b) => a.id - b.id))
		const filteredMessages = {
			count: messages.count,
			rows: groupedMessages
		};
		return res.json(filteredMessages);
	}
}

module.exports = new MessengerController();
