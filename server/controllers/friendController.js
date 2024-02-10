const { Op } = require("sequelize");
const {
  Friend,
  Subscriber,
  User,
  Likes,
  Comments,
  Notifications,
  UserFriend,
} = require("../models/models");
const ApiError = require("../error/ApiError");
const { getIo } = require("../socket");

class FriendController {}

module.exports = new FriendController();
