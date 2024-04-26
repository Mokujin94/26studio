const ApiError = require("../error/ApiError");
const { Chats, User, ChatParticipants, Messages } = require("../models/models");
require("dotenv").config();

class ChatController {
  async getOne(req, res, next) {
    const {id} = req.params;

    const chat = await Chats.findOne({
        include: [
            {
                model: User,
                through: ChatParticipants
            }
        ],
        where: {id}
    })

    return res.json(chat);
  }

	async createMessage(req, res, next) {
    const { content, userId } = req.body;
		const { id } = req.params;

		const message = await Messages.create({
			content,
			userId,
			chatId: id
		})
  
    return res.json(message);
  }

	async getMessages(req, res, next) {
    const {  userId } = req.query;
		const { id } = req.params;

		const message = await Messages.findAll({
			where: { 
				userId,
				chatId: id
			}
		})

		const messageOther = await Messages.findAll({
			where: { 
				userId: id,
				chatId: userId
			}
		})

		let messages = message.concat(messageOther);
		messages.sort((a, b) =>  new Date(b.createdAt) - new Date(a.createdAt))

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
	
	const groupedMessages = groupMessagesByUser(messages);

  return res.json(groupedMessages);
  }
}

module.exports = new ChatController();
