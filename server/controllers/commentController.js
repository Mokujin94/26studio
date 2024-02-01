const ApiError = require("../error/ApiError");
const {
  Comments,
  Project,
  News,
  User,
  Notifications,
  Likes,
} = require("../models/models");
const { getIo } = require("../socket");

class CommentController {
  async getAllCommentsProject(req, res, next) {
    try {
      const { id } = req.params;

      const comments = await Project.findAll({
        include: [
          {
            model: Comments,
            include: User,
          },
        ],
        where: {
          id,
        },
      });

      return res.json(comments);
    } catch (error) {
      next(ApiError.badRequest(error.message));
    }
  }

  async getAllCommentsNews(req, res, next) {
    try {
      const { id } = req.params;

      const comments = await News.findAll({
        include: [
          {
            model: Comments,
            include: User,
          },
        ],
        where: {
          id,
        },
      });

      return res.json(comments);
    } catch (error) {
      next(ApiError.badRequest(error.message));
    }
  }

  async createCommentProject(req, res, next) {
    try {
      const { message, projectId, resendId, userId } = req.body;

      if (!userId) {
        return next(ApiError.internal("Вы не авторизованы"));
      }

      const comment = await Comments.create({
        message,
        projectId,
        resendId,
        userId,
      });

      const savedComment = await Comments.findOne({
        where: { id: comment.id },
        include: [
          User,
          {
            model: Project,
            include: [User],
          },
        ],
      });

      const notification = await Notifications.create({
        commentId: comment.id,
        senderId: userId,
        recipientId: Project.user.id,
      });

      const sendNotification = await Notifications.findOne({
        where: { id: notification.id },
        include: [
          {
            model: Comments,
            as: "comment",
          },
          {
            model: Likes,
            as: "like",
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

      const io = getIo();
      io.emit("sendCommentsToClients", savedComment);
      return res.json(savedComment);
    } catch (error) {
      next(ApiError.badRequest(error.message));
    }
  }

  async createCommentNews(req, res, next) {
    try {
      const { message, newsId, resendId, userId } = req.body;

      const comment = await Comments.create({
        message,
        newsId,
        resendId,
        userId,
      });

      const savedComment = await Comments.findOne({
        where: { id: comment.id },
        include: [
          {
            model: User,
            attributes: ["id", "name", "avatar"],
          },
        ],
      });

      const io = getIo();
      io.emit("sendCommentsNewsToClients", savedComment);
      return res.json(comment);
    } catch (error) {
      next(ApiError.badRequest(error.message));
    }
  }
}

module.exports = new CommentController();
