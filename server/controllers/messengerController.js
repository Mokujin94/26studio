const { Op, json } = require("sequelize");
const ApiError = require("../error/ApiError");
const { Chats, User, Messages, ChatMembers } = require("../models/models");
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
					model: Messages
				}
			],
		});

		if (!commonChat) {
			chat = {
				is_group: false,
				member: user,
				messages: []
			}
		} else {
			chat = commonChat ? commonChat.get({ plain: true }) : {}; // Если нужно получить "чистый" объект
			chat.member = user; // Добавляем свойство
		}



		chat.messages.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))

		function groupMessagesByUser(messages) {
			return messages.reduce((acc, message) => {
				const lastGroup = acc[acc.length - 1];
				if (lastGroup && lastGroup[0].userId === message.userId) {
					lastGroup.push(message);
				} else {
					acc.push([message]);
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
							order: [
								["createdAt", "DESC"]
							],
							limit: 1 // Получаем последние сообщения, если нужно
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
					model: Messages
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
		io.to(`chat_${chat.id}`).emit('newMessage', message);

		return res.json(message)


	}
}

module.exports = new MessengerController();
