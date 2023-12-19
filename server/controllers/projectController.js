const { Project, Likes, User, Comments } = require("../models/models");
const uuid = require("uuid");
const path = require("path");
const ApiError = require("../error/ApiError");
const { getIo } = require("../socket");

class ProjectController {
  async create(req, res, next) {
    try {
      const { name, start_date, description, files } = req.body;
      const { img } = req.files;
      let fileName = uuid.v4() + ".jpg";
      img.mv(path.resolve(__dirname, "..", "static/projects", fileName));
      const project = await Project.create({
        name,
        start_date,
        description,
        files,
        img: fileName,
      });
      return res.json(project);
    } catch (e) {
      next(ApiError.badRequest(e.message));
    }
  }

  async getAll(req, res) {
    let { limit, page } = req.query;
    page = page || 1;
    limit = limit || 9;
    let offset = page * limit - limit;

    let projects = await Project.findAndCountAll(
      { include: [Likes, Comments] },
      { limit, offset }
    );
    return res.json(projects);
  }

  async getOne(req, res) {
    const { id } = req.params;
    const project = await Project.findOne({
      include: Likes,
      where: { id },
    });

    return res.json(project);
  }

  async getAllUser(req, res) {
    const { id } = req.params;
    let projects = await User.findOne({
      include: [
        {
          model: Project,
          include: [Likes, Comments], // Включаем связь с моделью Like внутри связи с Project
        },
      ],
      where: { id },
    });
    return res.json(projects);
  }

  async condidateLike(req, res, next) {
    const { projectId, userId } = req.query;

    if (!userId) {
      return next(ApiError.internal("Не авторизован"));
    }

    const condidate = await Likes.findAll({
      where: { userId, projectId },
    });

    return res.json(condidate);
  }

  async setLike(req, res, next) {
    const { projectId, userId } = req.body;

    if (!userId) {
      return next(ApiError.internal("Не авторизован"));
    }

    const likes = await Likes.create({
      projectId,
      userId,
    });

    const allLikes = await Project.findAll({
      include: [Likes, Comments],
      where: { id: projectId },
    });
    const io = getIo();
    io.emit("sendLikesToClients", allLikes);
    return res.json(likes);
  }

  async deleteLike(req, res, next) {
    const { projectId, userId } = req.query;
    if (!userId) {
      return next(ApiError.internal("Не авторизован"));
    }
    const likes = await Likes.destroy({
      where: { projectId, userId },
    });

    const allLikes = await Project.findAll({
      include: [Likes, Comments],
      where: { id: projectId },
    });
    const io = getIo();
    io.emit("sendLikesToClients", allLikes);
    return res.json(likes);
  }
}

module.exports = new ProjectController();
