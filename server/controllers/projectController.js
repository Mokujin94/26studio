const {
  Project,
  Likes,
  User,
  Comments,
  View,
  Notifications,
} = require("../models/models");
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
    limit = limit || 12;
    filter = filter || "0";
    let offset = page * limit - limit;
    let projects;

    const totalCount = await Project.count();
    if (filter === "0") {
      projects = await Project.findAndCountAll({
        // attributes: Object.keys(Project.rawAttributes),
        include: [Likes, Comments, User, View],
        order: [
          [
            Sequelize.literal(
              '(SELECT COUNT(*) FROM "likes" WHERE "likes"."projectId" = "project"."id")'
            ),
            "DESC",
          ],
        ],
        offset,
        limit,
        where: {
          is_private: false,
        },
      });
    } else if (filter === "1") {
      projects = await Project.findAndCountAll({
        // attributes: Object.keys(Project.rawAttributes),
        include: [Likes, Comments, User, View],
        order: [
          [
            Sequelize.literal(
              '(SELECT COUNT(*) FROM "views" WHERE "views"."projectId" = "project"."id")'
            ),
            "DESC",
          ],
        ],
        offset,
        limit,
        where: {
          is_private: false,
        },
      });
    } else if (filter === "2") {
      projects = await Project.findAndCountAll({
        include: [Likes, Comments, User, View],
        order: [["createdAt", "DESC"]], // Сортировка по полю createdAt в убывающем порядке
        offset,
        limit,
        where: {
          is_private: false,
        },
      });
    }
    return res.json({ count: totalCount, rows: projects.rows });
  }

  async getOne(req, res) {
    const { id } = req.params;
    const project = await Project.findOne({
      where: { id },
      include: [
        {
          model: Likes,
          where: { status: true },
          required: false,
        },
        View,
      ],
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
      where: { userId, projectId, status: true },
    });

    return res.json(condidate);
  }

  async setLike(req, res, next) {
    const { projectId, userId } = req.body;
    const io = getIo();
    let likes;

    if (!userId) {
      return next(ApiError.internal("Не авторизован"));
    }

    const checkLikeOnProject = await Project.findOne({
      where: { id: projectId },
      include: [
        {
          model: Likes,
          where: { userId, status: true },
        },
      ],
    });

    const userProject = await Project.findOne({
      where: { id: projectId },
      include: [User],
    });

    if (checkLikeOnProject) {
      likes = await Likes.findOne({
        where: { projectId, userId, status: false },
      });
      likes.update({
        status: true,
      });
    } else {
      likes = await Likes.create({
        projectId,
        userId,
        status: true,
      });

      const notification = await Notifications.create({
        likeId: likes.id,
        senderId: userId,
        recipientId: userProject.user.id,
      });
      const sendNotification = await Notifications.findOne({
        where: { id: notification.id },
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
      });
      io.emit("notification", sendNotification);
    }

    // const checkLikeOnProject1 = await User.findOne({
    //   where: {id: userId},
    //   include: [{
    //     model: Likes,
    //     where: {projectId, status: true}
    //   }]
    // })

    const allLikes = await Project.findAll({
      include: [
        {
          model: Likes,
          where: { status: true },
        },
        Comments,
        View,
      ],
      where: { id: projectId },
    });

    io.emit("sendLikesToClients", allLikes);
    return res.json(likes);
  }

  async deleteLike(req, res, next) {
    const { projectId, userId } = req.body;
    let likes;
    if (!userId) {
      return next(ApiError.internal("Не авторизован: " + userId));
    }
    likes = await Likes.findOne({
      where: { projectId, userId, status: true },
    });

    await likes.update({ status: false });

    const allLikes = await Project.findAll({
      include: [
        {
          model: Likes,
          where: { status: true },
        },
        Comments,
        View,
      ],
      where: { id: projectId },
    });
    const io = getIo();
    io.emit("sendLikesToClients", allLikes);
    return res.json(likes);
  }

  async searchProject(req, res) {
    let { search, limit, page, filter } = req.query;
    page = page || 1;
    limit = limit || 12;
    let offset = page * limit - limit;
    let whereCondition = {
      [Op.or]: {
        name: {
          [Op.iLike]: "%" + search + "%",
        },
        description: {
          [Op.iLike]: "%" + search + "%",
        },
      },
      is_private: false,
    };

    let countCondition = {
      where: whereCondition,
    };

    if (filter === "0") {
      countCondition.include = [Likes, Comments, User, View];
    } else if (filter === "1") {
      countCondition.include = [Likes, Comments, User, View];
    } else if (filter === "2") {
      countCondition.include = [Likes, Comments, User, View];
    }

    const totalCountProjects = await Project.count();
    const totalCountSearch = await Project.findAll(countCondition);

    let projects;

    if (filter === "0") {
      projects = await Project.findAll({
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
        where: whereCondition,
      });
    } else if (filter === "1") {
      projects = await Project.findAll({
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
        where: whereCondition,
      });
    } else if (filter === "2") {
      projects = await Project.findAll({
        include: [Likes, Comments, User, View],
        limit,
        offset,
        order: [["createdAt", "DESC"]],
        where: whereCondition,
      });
    }

    return res.json({
      count: totalCountProjects,
      rows: projects,
      countSearch: totalCountSearch.length,
    });
  }
}

module.exports = new ProjectController();
