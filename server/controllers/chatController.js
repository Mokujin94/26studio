const ApiError = require("../error/ApiError");
const { Chats, User, ChatParticipants } = require("../models/models");
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
}

module.exports = new ChatController();
