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

      let groups = await Group.findAndCountAll();
      return res.json(groups);
    } catch (error) {
      next(ApiError.badRequest(error.message));
    }
  }

  async getOne(req, res, next) {
    try {
      const { id } = req.params;
      const group = await Group.findOne({
        where: { id },
      });
      return res.json(group);
    } catch (error) {
      next(ApiError.badRequest(error.message));
    }
  }
  async addMember(req, res, next) {
    try {
      const { id } = req.params;
      const { id_user } = req.body;
      const group = await Group.findOne({
        where: { id },
      });
      const user = await User.findOne({
        where: { id: id_user },
      });
      group.members.map(({ id }) => {
        if (id === id_user) {
          return next(ApiError.internal("Пользователь уже существует"));
        }
      });
      let newMembers;
      if (group.members === null) {
        group.update({
          members: [
            {
              id: id_user,
            },
          ],
        });
      } else {
        user.update({
          group_status: true,
        });
        newMembers = { id: id_user };
        group.update({
          members: [...group.members, newMembers],
        });
      }

      return res.json(group);
    } catch (error) {
      next(ApiError.badRequest(error.message));
    }
  }

  async deleteMember(req, res, next) {
    try {
      const { id } = req.params;
      const { id_user } = req.body;
      const group = await Group.findOne({
        where: { id },
      });
      const user = await User.findOne({
        where: { id: id_user },
      });
      let newMembers = group.members.filter((item) => {
        return item.id !== id_user;
      });
      user.update({
        group_status: false,
      });
      group.update({
        members: newMembers,
      });
      return res.json(group);
    } catch (error) {
      next(ApiError.badRequest(error.message));
    }
  }
}

module.exports = new GroupController();
