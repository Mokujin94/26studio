const { Project, Likes, User, Comments, View } = require("../models/models");
const uuid = require("uuid");
const path = require("path");
const ApiError = require("../error/ApiError");
const { getIo } = require("../socket");
const { Op, Sequelize } = require("sequelize");

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
    let { limit, page, filter } = req.query;
    page = page || 1;
    limit = limit || 9;
    filter = filter || "0";
    let offset = page * limit - limit;
    let projects;
    if (filter === "0") {
      projects = await Project.findAndCountAll({
        attributes: Object.keys(Project.rawAttributes),
        include: [Likes, Comments, User, View],
        order: [
          [
            Sequelize.literal(
              '(SELECT COUNT(*) FROM "likes" WHERE "likes"."projectId" = "project"."id")'
            ),
            "DESC",
          ],
        ],
        limit,
        offset,
      });
    } else if (filter === "1") {
      projects = await Project.findAndCountAll({
        attributes: Object.keys(Project.rawAttributes),
        include: [Likes, Comments, User, View],
        order: [
          [
            Sequelize.literal(
              '(SELECT COUNT(*) FROM "views" WHERE "views"."projectId" = "project"."id")'
            ),
            "DESC",
          ],
        ],
        limit,
        offset,
      });
    } else if (filter === "2") {
      projects = await Project.findAndCountAll({
        include: [Likes, Comments, User, View],
        order: [["createdAt", "DESC"]], // Сортировка по полю createdAt в убывающем порядке
        limit,
        offset,
      });
    }
    return res.json(projects);
  }

  async getOne(req, res) {
    const { id } = req.params;
    const project = await Project.findOne({
      include: [Likes, View],
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
          include: [Likes, Comments, View],
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
      include: [Likes, Comments, View],
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
      include: [Likes, Comments, View],
      where: { id: projectId },
    });
    const io = getIo();
    io.emit("sendLikesToClients", allLikes);
    return res.json(likes);
  }

  async searchProject(req, res) {
    let { search, limit, page, filter } = req.query;
    page = page || 1;
    limit = limit || 9;
    let offset = page * limit - limit;

    let projects;
    if (filter === "0") {
      projects = await Project.findAndCountAll({
        attributes: Object.keys(Project.rawAttributes),
        include: [Likes, Comments, User, View],
        order: [
          [
            Sequelize.literal(
              '(SELECT COUNT(*) FROM "likes" WHERE "likes"."projectId" = "project"."id")'
            ),
            "DESC",
          ],
        ],
        limit,
        offset,
        where: {
          [Op.or]: {
            name: {
              [Op.iLike]: "%" + search + "%",
            },
            description: {
              [Op.iLike]: "%" + search + "%",
            },
          },
          is_private: false,
        },
      });
    } else if (filter === "1") {
      projects = await Project.findAndCountAll({
        attributes: Object.keys(Project.rawAttributes),
        include: [Likes, Comments, User, View],
        order: [
          [
            Sequelize.literal(
              '(SELECT COUNT(*) FROM "views" WHERE "views"."projectId" = "project"."id")'
            ),
            "DESC",
          ],
        ],
        limit,
        offset,
        where: {
          [Op.or]: {
            name: {
              [Op.iLike]: "%" + search + "%",
            },
            description: {
              [Op.iLike]: "%" + search + "%",
            },
          },
          is_private: false,
        },
      });
    } else if (filter === "2") {
      projects = await Project.findAndCountAll({
        include: [Likes, Comments, User, View],
        limit,
        offset,
        order: [["createdAt", "DESC"]],
        where: {
          [Op.or]: {
            name: {
              [Op.iLike]: "%" + search + "%",
            },
            description: {
              [Op.iLike]: "%" + search + "%",
            },
          },
          is_private: false,
        },
      });
    }
    return res.json(projects);
  }
}

module.exports = new ProjectController();
