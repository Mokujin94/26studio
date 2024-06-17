const { where } = require("sequelize");
const ApiError = require("../error/ApiError");
const { Draft } = require("../models/models");
require("dotenv").config();

class DraftController {
	async getAll(req, res, next) {
    try {
      const { userId } = req.params;
			const drafts = await Draft.findAll({
				where: { userId }
			})
      return res.json(drafts);
    } catch (error) {
      next(ApiError.badRequest(error.message));
    }
  }

  async update(req, res, next) {
    try {
      const { userId, chatId, text } = req.body;
			console.log(userId);
			console.log(chatId);
			console.log(text);
			const draft = await Draft.findOne({
				where: { userId, chatId }
			})
			if (draft) {
				draft.update({ text })
      	return res.json(draft);
			}
			const newDraft = await Draft.create({
				 userId, chatId, text 
			})
			return res.json(newDraft);
    } catch (error) {
      next(ApiError.badRequest(error.message));
    }
  }

}

module.exports = new DraftController();