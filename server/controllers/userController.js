const ApiError = require("../error/ApiError");
require("dotenv").config();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const {
  User,
  Friend,
  UserAchivment,
  GettingAchivment,
} = require("../models/models");

const generateJwt = (id, name, email, roleId) => {
  return jwt.sign({ id, name, email, roleId }, process.env.SECRET_KEY, {
    expiresIn: "24h",
  });
};

class UserController {
  async registration(req, res, next) {
    const { name, full_name, email, password, roleId } = req.body;
    if (!email || !password) {
      return next(ApiError.badRequest("Неверная почта или пароль"));
    }
    const condidate = await User.findOne({ where: { email } });
    if (condidate) {
      return next(
        ApiError.badRequest("Пользовательно с такой почтой существует")
      );
    }
    const hashPassword = await bcrypt.hash(password, 5);
    const user = await User.create({
      name,
      full_name,
      email,
      password: hashPassword,
      roleId,
    });
    const achivment = await UserAchivment.create({ userId: user.id });
    const gettingAchivment = await GettingAchivment.create({ userId: user.id });
    const token = generateJwt(
      user.id,
      user.name,
      user.full_name,
      user.email,
      user.roleId
    );
    return res.json({ token });
  }

  async login(req, res, next) {
    const { name, email, password } = req.body;
    const user = await User.findOne({ where: { email, name } });
    if (!user) {
      return next(ApiError.internal("Пользователь с такой почтой не найден"));
    }
    let comparePassword = bcrypt.compareSync(password, user.password);
    if (!comparePassword) {
      return next(ApiError.internal("Неверная почта или пароль"));
    }
    const token = generateJwt(user.id, user.name, user.email, user.roleId);
    return res.json({ token });
  }

  async check(req, res) {
    const token = generateJwt(
      req.user.id,
      req.user.name,
      req.user.email,
      req.user.roleId
    );
    return res.json({ token });
  }

  async getFriends(req, res) {
    const { id } = req.params;
    const friends = await Friend.findAll({ where: { id } });
    return res.json(friends);
  }
}
module.exports = new UserController();
