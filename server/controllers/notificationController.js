const { Op, Sequelize } = require("sequelize");
const {
  Project,
  Likes,
  User,
  Comments,
  View,
  Notifications,
} = require("../models/models");
const ApiError = require("../error/ApiError");

class NotificationController {
  async getAll(req, res) {
    try {
      const { recipientId } = req.query;
      const notification = await Notifications.findAll({
        include: [
          {
            model: Likes,
            as: "like", // Укажите алиас, который соответствует вашей ассоциации
          },
          {
            model: User,
            as: "sender", // Укажите алиас, который соответствует вашей ассоциации
          },
          {
            model: User,
            as: "recipient", // Укажите алиас, который соответствует вашей ассоциации
          },
        ],
        where: {
          recipientId,
          senderId: {
            [Op.ne]: recipientId,
          },
        },
      });
      return res.json(notification);
    } catch (error) {
      next(ApiError.badRequest(error.message));
    }
  }

  async viewNotification(req, res) {
    try {
      const { recipientId } = req.body;
      await Notifications.update(
        { status: true },
        { where: { recipientId, status: false } }
      );
      const notification = await Notifications.findAll({
        include: [
          {
            model: Likes,
            as: "like", // Укажите алиас, который соответствует вашей ассоциации
          },
          {
            model: User,
            as: "sender", // Укажите алиас, который соответствует вашей ассоциации
          },
          {
            model: User,
            as: "recipient", // Укажите алиас, который соответствует вашей ассоциации
          },
        ],
        where: { recipientId },
      });
      return res.json(notification);
    } catch (error) {
      next(ApiError.badRequest(error.message));
    }
  }
}

module.exports = new NotificationController();
