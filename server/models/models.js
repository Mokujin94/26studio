const sequelize = require("../db");
const { DataTypes } = require("sequelize");
const { Sequelize } = require("../db");

let now = new Date();

const User = sequelize.define("user", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING, unique: true },
  full_name: { type: DataTypes.STRING },
  email: { type: DataTypes.STRING, unique: true },
  password: { type: DataTypes.STRING },
  description: { type: DataTypes.STRING },
  avatar: { type: DataTypes.STRING, defaultValue: "avatar.jpg" },
  group_status: { type: DataTypes.BOOLEAN, defaultValue: false },
  achivment_list: { type: DataTypes.JSON },
});

const Friend = sequelize.define("friend", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  id_sender: { type: DataTypes.INTEGER },
  id_recipient: { type: DataTypes.INTEGER },
});

const Subscriber = sequelize.define("subscriber", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  id_sender: { type: DataTypes.INTEGER },
  id_recipient: { type: DataTypes.INTEGER },
});

const Group = sequelize.define("group", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING },
  members: { type: DataTypes.JSON, defaultValue: [] },
  id_curator: { type: DataTypes.INTEGER },
});

const Role = sequelize.define("role", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING },
});

const Project = sequelize.define("project", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING, allowNull: false },
  start_date: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  description: { type: DataTypes.STRING, defaultValue: "Нет описания" },
  path_from_project: { type: DataTypes.STRING, allowNull: false },
  baseURL: { type: DataTypes.STRING, allowNull: false },
  preview: { type: DataTypes.STRING, allowNull: false },
  is_private: { type: DataTypes.BOOLEAN, defaultValue: false },
  is_private_comments: { type: DataTypes.BOOLEAN, defaultValue: false },
  views: { type: DataTypes.JSON },
  amount_views: { type: DataTypes.INTEGER, defaultValue: 0 },
  likes: { type: DataTypes.JSON },
  amount_likes: { type: DataTypes.INTEGER, defaultValue: 0 },
  comments: { type: DataTypes.JSON },
  amount_comments: { type: DataTypes.INTEGER, defaultValue: 0 },
});

const TeamAccess = sequelize.define("team_access", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  role: { type: DataTypes.STRING },
  give_privileges: { type: DataTypes.BOOLEAN },
  read_privileges: { type: DataTypes.BOOLEAN },
  insert_privileges: { type: DataTypes.BOOLEAN },
  update_privileges: { type: DataTypes.BOOLEAN },
  invite_privileges: { type: DataTypes.BOOLEAN },
  kick_privileges: { type: DataTypes.BOOLEAN },
});

const Team = sequelize.define("team", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING },
});

const WhiteListUser = sequelize.define("white_list_user", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
});

const Achivment = sequelize.define("achivment", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING },
  rule: { type: DataTypes.STRING },
  icon: { type: DataTypes.STRING },
});

const GettingAchivment = sequelize.define("getting_achivment", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
});

const UserAchivment = sequelize.define("user_achivment", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  amount: { type: DataTypes.INTEGER },
});

const News = sequelize.define("news", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  title: { type: DataTypes.STRING, allowNull: false },
  description: { type: DataTypes.STRING, allowNull: false },
  img: { type: DataTypes.STRING },
  views: { type: DataTypes.JSON },
  amount_views: { type: DataTypes.INTEGER, defaultValue: 0 },
  likes: { type: DataTypes.JSON },
  amount_likes: { type: DataTypes.INTEGER, defaultValue: 0 },
  comments: { type: DataTypes.JSON },
  amount_comments: { type: DataTypes.INTEGER, defaultValue: 0 },
});

const ProposedNews = sequelize.define("proposed_news", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  img: { type: DataTypes.STRING },
  title: { type: DataTypes.STRING },
  description: { type: DataTypes.STRING },
});

const UnpostedNews = sequelize.define("unposted_news", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  title: { type: DataTypes.STRING },
  img: { type: DataTypes.STRING },
  description: { type: DataTypes.STRING },
});

const Comments = sequelize.define("comments_all", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  message: { type: DataTypes.STRING },
  resendId:  {type: DataTypes.INTEGER}
});

const Message = sequelize.define("message", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  files: { type: DataTypes.STRING },
  is_updated: { type: DataTypes.BOOLEAN },
  is_deleted_all: { type: DataTypes.BOOLEAN },
  is_deleted: { type: DataTypes.BOOLEAN },
  is_read: { type: DataTypes.BOOLEAN },
  resended: { type: DataTypes.JSON },
});

const Chat = sequelize.define("chat", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING, allowNull: false },
  avatar: { type: DataTypes.STRING },
  members: { type: DataTypes.JSON },
});

const TypeOfAttachment = sequelize.define("type_of_attachment", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING },
});

User.hasMany(Project);
Project.belongsTo(User);

TeamAccess.hasMany(User);
User.belongsTo(TeamAccess);

User.hasMany(WhiteListUser);
WhiteListUser.belongsTo(User);

Team.hasMany(User);
User.belongsTo(Team);

Team.hasMany(Project);
Project.belongsTo(Team);

Team.hasMany(TeamAccess);
TeamAccess.belongsTo(Team);

Project.hasMany(Comments);
Comments.belongsTo(Project);

News.hasMany(Comments);
Comments.belongsTo(News);

User.hasMany(Friend);
Friend.belongsTo(User);

User.hasMany(Subscriber);
Subscriber.belongsTo(User);

User.belongsToMany(Achivment, { through: UserAchivment, GettingAchivment });
Achivment.belongsToMany(User, { through: UserAchivment, GettingAchivment });

User.hasMany(ProposedNews);
ProposedNews.belongsTo(User);

User.hasMany(UnpostedNews);
UnpostedNews.belongsTo(User);

User.hasMany(Message);
Message.belongsTo(User);

Group.hasMany(User);
User.belongsTo(Group);

Role.hasMany(User, { foreignKey: { defaultValue: 1 } });
User.belongsTo(Role);

Chat.hasMany(Message);
Message.belongsTo(Chat);

TypeOfAttachment.hasMany(Message);
Message.belongsTo(TypeOfAttachment);

module.exports = {
  User,
  Friend,
  Subscriber,
  Group,
  Role,
  Project,
  Team,
  TeamAccess,
  WhiteListUser,
  Achivment,
  GettingAchivment,
  UserAchivment,
  News,
  ProposedNews,
  UnpostedNews,
  Message,
  Chat,
};
sequelize.sync();
// sequelize
//   .sync()
//   .then(() => {
//     console.log("All models were synchronized successfully.");
//   })
//   .catch((error) => {
//     console.error("Error synchronizing models:", error);
//   });
