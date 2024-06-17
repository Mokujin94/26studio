const ApiError = require("../error/ApiError");
require("dotenv").config();
const { View, Project, Comments, Likes } = require("../models/models");
const { getIo } = require("../socket");

class ViewController {
  async viewProject(req, res, next) {
    try {
      const { projectId, userId } = req.body;

      if (!userId) {
        return next(ApiError.internal("Не авторизован"));
      }

      const view = await View.findOne({
        where: {
          projectId,
          userId,
        },
      });

      if (view !== null) {
        const allViews = await Project.findAll({
          include: [Likes, Comments, View],
          where: { id: projectId },
        });

        const io = getIo();
        io.emit("sendViewsToClients", allViews);
        return res.json(allViews);
      }

      const views = await View.create({
        projectId,
        userId,
      });

      const allViews = await Project.findAll({
        include: [Likes, Comments, View],
        where: { id: projectId },
      });

      const io = getIo();
      io.emit("sendViewsToClients", allViews);
      return res.json(allViews);
    } catch (error) {
      next(ApiError.badRequest(error.message));
    }
  }

  async viewNews(req, res, next) {
    try {
      const { newsId, userId } = req.body;

      if (!userId) {
        return next(ApiError.internal("Не авторизован"));
      }

      const view = await View.findOne({
        where: {
          newsId,
          userId,
        },
      });

      if (view !== null) {
        const allViews = await Project.findAll({
          include: [Likes, Comments, View],
          where: { id: newsId },
        });

        const io = getIo();
        io.emit("sendViewsNewsToClients", allViews);
        return res.json(allViews);
      }

      const views = await View.create({
        newsId,
        userId,
      });

      const allViews = await Project.findAll({
        include: [Likes, Comments, View],
        where: { id: newsId },
      });

      return res.json(allViews);
    } catch (error) {
      next(ApiError.badRequest(error.message));
    }
  }
}

module.exports = new ViewController();
