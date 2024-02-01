const { Op, Sequelize } = require("sequelize");
const {
  Project,
  Likes,
  User,
  Comments,
  View,
  Notifications,
} = require("../models/models");

class NotificationController {
  async getAll(req, res) {
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
          [Op.ne]: Sequelize.literal("recipientId"),
        },
      },
    });
    return res.json(notification);
  }

  async viewNotification(req, res) {
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
  }
}

module.exports = new NotificationController();
