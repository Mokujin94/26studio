const ApiError = require('../error/ApiError');
const uuid = require('uuid');
const path = require('path');
require('dotenv').config();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { User, Friend, UserAchivment, GettingAchivment } = require('../models/models');

const generateJwt = (id, name, full_name, email, description, avatar, groupId, roleId) => {
  return jwt.sign({ id, name, full_name, email, description, avatar, groupId, roleId }, process.env.SECRET_KEY, {
    expiresIn: '24h',
  });
};

class UserController {
  async checkCondidate(req, res, next) {
    const { name, email } = req.body;
    const condidateName = await User.findOne({ where: { name } });
    const condidateMail = await User.findOne({ where: { email } });
    if (condidateName && condidateMail) {
      return next(ApiError.badRequest('Пользовательно с таким ником и почтой существуют'));
    }
    if (condidateName) {
      return next(ApiError.badRequest('Пользовательно с таким ником существует'));
    }
    if (condidateMail) {
      return next(ApiError.badRequest('Пользовательно с такой почтой существует'));
    }
    return res.json();
  }
  async registration(req, res, next) {
    const { name, full_name, email, password, description, groupId, roleId } = req.body;

    let fileName;

    if (!email || !password) {
      return next(ApiError.badRequest('Неверная почта или пароль'));
    }
    const condidate = await User.findOne({ where: { email } });
    if (condidate) {
      return next(ApiError.badRequest('Пользовательно с такой почтой существует'));
    }
    if (req.files) {
      fileName = uuid.v4() + '.jpg';
      const { avatar } = req.files;
      avatar.mv(path.resolve(__dirname, '..', 'static/avatars', fileName));
    } else {
      fileName = 'avatar.jpg';
    }
    const hashPassword = await bcrypt.hash(password, 5);
    const user = await User.create({
      name,
      full_name,
      email,
      password: hashPassword,
      description,
      avatar: fileName,
      groupId,
      roleId,
    });
    const achivment = await UserAchivment.create({ userId: user.id });
    const gettingAchivment = await GettingAchivment.create({ userId: user.id });
    const token = generateJwt(
      user.id,
      user.name,
      user.full_name,
      user.email,
      user.description,
      user.avatar,
      user.groupId,
      user.roleId
    );
    return res.json({ token });
  }

  async login(req, res, next) {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return next(ApiError.internal('Пользователь с такой почтой не найден'));
    }
    let comparePassword = bcrypt.compareSync(password, user.password);
    if (!comparePassword) {
      return next(ApiError.internal('Неверная почта или пароль'));
    }
    const token = generateJwt(
      user.id,
      user.name,
      user.full_name,
      user.email,
      user.description,
      user.avatar,
      user.groupId,
      user.roleId
    );
    return res.json({ token });
  }

  async check(req, res) {
    const token = generateJwt(
      req.user.id,
      req.user.name,
      req.user.full_name,
      req.user.email,
      req.user.description,
      req.user.avatar,
      req.user.groupId,
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
