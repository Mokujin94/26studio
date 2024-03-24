const ApiError = require("../error/ApiError");
require("dotenv").config();
const { Role } = require("../models/models");

class RolesController {
  async create(req, res, next) {
    try {
      const { name } = req.body;
      const role = await Role.create({ name });
      return res.json(role);
    } catch (e) {
      next(ApiError.badRequest(e.message));
    }
  }
}

module.exports = new RolesController();
