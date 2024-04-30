const { Op, json } = require("sequelize");
const ApiError = require("../error/ApiError");
const { Chats, User, Messages, ChatMembers } = require("../models/models");
const { sequelize } = require("../db");
const clientRedis = require("../redis");
require("dotenv").config();


class MessengerController {
	async getOnePersonal(req, res, next) {
		const { otherUserId, userId } = req.body;
		let user = await clientRedis.get(`user${otherUserId}`)
		let chat = await clientRedis.get(`chatPersonal${otherUserId}${userId}`)

		if(!user) {
			user = await User.findOne({
				where: { id: otherUserId }
			})
			await clientRedis.set(`user${otherUserId}`, JSON.stringify(user));
		}
		if(!chat) {
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
					member: JSON.parse(user),
					messages: []
				}
			} else {
				chat = commonChat ? commonChat.get({ plain: true }) : {}; // Если нужно получить "чистый" объект
				chat.member = user; // Добавляем свойство
				await clientRedis.set(`chatPersonal${otherUserId}${userId}`, JSON.stringify(chat));
			}
			return res.json(chat)
		} else {
			return res.json(JSON.parse(chat))
		}
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

		let user = await clientRedis.get(`user${otherUserId}`)
		let chat = await clientRedis.get(`chatPersonal${otherUserId}${userId}`)
		let parseChat = JSON.parse(chat);
		if(!user) {
			user = await User.findOne({
				where: { id: otherUserId }
			})
			await clientRedis.set(`user${otherUserId}`, JSON.stringify(user));
		}
		if(!chat) {
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
			const currentChat = await Chats.findOne({
				where: { id: chat.id },
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
			})
	
			chat = currentChat ? currentChat.get({ plain: true }) : {}; // Если нужно получить "чистый" объект
			chat.member = JSON.parse(user); // Добавляем свойство
			await clientRedis.set(`chatPersonal${otherUserId}${userId}`, JSON.stringify(chat));
			return res.json(message)
		} else {
			const message = await Messages.create({
				userId,
				chatId: parseChat.id,
				text
			})
			const currentChat = await Chats.findOne({
				where: { id: parseChat.id },
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
			})
	
			chat = currentChat ? currentChat.get({ plain: true }) : {}; // Если нужно получить "чистый" объект
			chat.member = JSON.parse(user); // Добавляем свойство
			await clientRedis.set(`chatPersonal${otherUserId}${userId}`, JSON.stringify(chat));
			return res.json(message)

		}
	}
}

module.exports = new MessengerController();
