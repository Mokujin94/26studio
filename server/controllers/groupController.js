const { Group, User } = require("../models/models");
const ApiError = require("../error/ApiError");

class GroupController {
  async create(req, res, next) {
    try {
      const { name } = req.body;
      const group = await Group.create({ name });
      return res.json(group);
    } catch (e) {
      next(ApiError.badRequest(e.message));
    }
  }

  async getAll(req, res, next) {
    try {
      // let {limit, page} = req.query
      // page = page || 1
      // limit = limit || 12
      // let offset = page * limit - limit

      let groups = await Group.findAndCountAll({
        include: [User]
      });
      return res.json(groups);
    } catch (error) {
      next(ApiError.badRequest(error.message));
    }
  }

  async getOne(req, res, next) {
    try {
      const { id } = req.params;
      const group = await Group.findOne({
        include: [User],
        where: { id },
      });
      return res.json(group);
    } catch (error) {
      next(ApiError.badRequest(error.message));
    }
  }
  async addMember(req, res, next) {
    try {
      const { id_user } = req.body;
     
      const user = await User.findOne({where: {id: id_user}})

      if (user) {
        await user.update({group_status: true})
      }
     
      return res.json(user);
    } catch (error) {
      next(ApiError.badRequest(error.message));
    }
  }

  async deleteMember(req, res, next) {
    try {
      const { id_user } = req.body;
      const user = await User.findOne({
        where: { id: id_user },
      });
      if (user) {
        await user.update({
          group_status: false,
        });
      }
      return res.json(user);
    } catch (error) {
      next(ApiError.badRequest(error.message));
    }
  }
}

module.exports = new GroupController();
