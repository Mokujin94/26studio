const { Op } = require("sequelize");
const ApiError = require("../error/ApiError");
const { User, Project, News, Group } = require("../models/models");
require("dotenv").config();
const { getIo } = require("../socket");

class SearchController {
  async searching(req, res, next) {
    try {
      const { search } = req.query;

      // if (!search) {
      //   return res.json();
      // }

      const users = await User.findAll({
        where: {
          [Op.or]: {
            name: {
              [Op.iLike]: "%" + search + "%",
            },
            full_name: {
              [Op.iLike]: "%" + search + "%",
            },
          },
        },
        include: [Group],
        required: false,
      });

      const projects = await Project.findAll({
        where: {
          [Op.or]: {
            name: {
              [Op.iLike]: "%" + search + "%",
            },
          },
        },
        include: [
          {
            model: User,
            where: {
              [Op.or]: {
                name: {
                  [Op.iLike]: "%" + search + "%",
                },
                full_name: {
                  [Op.iLike]: "%" + search + "%",
                },
              },
            },
            required: false,
          },
        ],
        required: false,
      });

      const groups = await Group.findAll({
        where: {
          [Op.or]: {
            name: {
              [Op.iLike]: "%" + search + "%",
            },
          },
        },
        required: false,
      });

      res.json({ users, projects, groups });
    } catch (error) {
      next(ApiError.badRequest(e.message));
    }
  }
}

module.exports = new SearchController();
