const { Op, json } = require("sequelize");
const ApiError = require("../error/ApiError");
const { Chats, User, Messages, ChatMembers } = require("../models/models");
const { sequelize } = require("../db");
const clientRedis = require("../redis");
require("dotenv").config();


class MessengerController {
	async getOnePersonal(req, res, next) {
		const { otherUserId, userId } = req.body;

		const user1 = await User.findOne({
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

		const chat = commonChat ? commonChat.get({ plain: true }) : {}; // Если нужно получить "чистый" объект

		chat.member = user1; // Добавляем свойство

		if (!commonChat) {
			const newChat = await Chats.create({
				name: `Chat${otherUserId}${userId}`
			});
			await ChatMembers.create({
				chatId: newChat.id,
				userId: otherUserId
			})
			await ChatMembers.create({
				chatId: newChat.id,
				userId: userId
			})

			const findNewChat = await Chats.findOne({
				where: { id: newChat.id },
				include: [
					{
						model: User,
						as: 'members',
						through: {
							model: ChatMembers,
							attributes: []
						}
					},
					{
						model: Messages
					}
				]
			})

			return res.json(findNewChat)
		}
		(await clientRedis).set('user', JSON.stringify(user1));
		(await clientRedis).quit()
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
							limit: 1 // Получаем последние сообщения, если нужно
						}
					]
				}
			]
		});

		return res.json(userChats)
	}

	async createMessages(req, res, next) {
		// const {userId, chatId} = 
	}
}

module.exports = new MessengerController();
