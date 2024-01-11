const { News, Likes, Comments, User, View } = require("../models/models");
const uuid = require("uuid");
const path = require("path");
const ApiError = require("../error/ApiError");
const { getIo } = require("../socket");

class NewsController {
  async create(req, res, next) {
    try {
      const { title, description } = req.body;
      const { img } = req.files;
      let fileName = uuid.v4() + ".jpg";
      img.mv(path.resolve(__dirname, "..", "static/news", fileName));
      const news = await News.create({ title, description, img: fileName });
      return res.json(news);
    } catch (e) {
      next(ApiError.badRequest(e.message));
    }
  }

  async getAll(req, res) {
    let { limit, page } = req.query;
    page = page || 1;
    limit = limit || 12;
    let offset = page * limit - limit;

    let news = await News.findAndCountAll({
      include: [Comments, Likes, View],
      limit,
      offset,
    });
    return res.json(news);
  }

  async getOne(req, res) {
    const { id } = req.params;
    const news = await News.findOne({
      where: { id },
      include: [Comments, Likes, View],
    });
    return res.json(news);
  }

  async condidateLike(req, res, next) {
    const { newsId, userId } = req.query;

    if (!userId) {
      return next(ApiError.internal("Не авторизован"));
    }

    const condidate = await Likes.findAll({
      where: { userId, newsId },
    });

    return res.json(condidate);
  }

  async setLike(req, res, next) {
    const { newsId, userId } = req.body;

    if (!userId) {
      return next(ApiError.internal("Не авторизован"));
    }

    const likes = await Likes.create({
      newsId,
      userId,
    });

    const allLikes = await News.findAll({
      include: [Likes, Comments, View],
      where: { id: newsId },
    });
    const io = getIo();
    io.emit("sendLikesNewsToClients", allLikes);
    return res.json(likes);
  }

  async deleteLike(req, res, next) {
    const { newsId, userId } = req.query;
    if (!userId) {
      return next(ApiError.internal("Не авторизован"));
    }
    const likes = await Likes.destroy({
      where: { newsId, userId },
    });

    const allLikes = await News.findAll({
      include: [Likes, Comments, View],
      where: { id: newsId },
    });
    const io = getIo();
    io.emit("sendLikesNewsToClients", allLikes);
    return res.json(likes);
  }
}

module.exports = new NewsController();
