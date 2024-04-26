const { DataTypes } = require("sequelize");
const { sequelize } = require("../db");

let now = new Date();

const User = sequelize.define("user", {
	id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
	name: { type: DataTypes.STRING, unique: true },
	full_name: { type: DataTypes.STRING },
	email: { type: DataTypes.STRING, unique: true },
	password: { type: DataTypes.STRING },
	description: { type: DataTypes.TEXT },
	avatar: { type: DataTypes.STRING, defaultValue: "avatar.jpg" },
	group_status: { type: DataTypes.BOOLEAN, defaultValue: false },
	achivment_list: { type: DataTypes.JSON },
	lastOnline: {
		type: DataTypes.DATE,
		allowNull: true // или false, в зависимости от ваших требований
	}
});


const Friend = sequelize.define("friend", {
	id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
	userId: { type: DataTypes.INTEGER },
	friendId: { type: DataTypes.INTEGER },
	status: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
});


const Group = sequelize.define("group", {
	id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
	name: { type: DataTypes.STRING },
});

const Role = sequelize.define("role", {
	id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
	name: { type: DataTypes.STRING },
});

const Project = sequelize.define("project", {
	id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
	name: { type: DataTypes.STRING, allowNull: false },
	start_date: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
	description: { type: DataTypes.TEXT, defaultValue: "Нет описания" },
	path_from_project: { type: DataTypes.STRING, allowNull: false },
	baseURL: { type: DataTypes.STRING, allowNull: false },
	preview: { type: DataTypes.STRING, allowNull: false },
	is_private: { type: DataTypes.BOOLEAN, defaultValue: false },
	is_private_comments: { type: DataTypes.BOOLEAN, defaultValue: false },
});

const News = sequelize.define("news", {
	id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
	title: { type: DataTypes.STRING, allowNull: false },
	description: { type: DataTypes.JSON, allowNull: false },
	img: { type: DataTypes.STRING },
	isProposed: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true },
});


const Comments = sequelize.define("comments", {
	id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
	message: { type: DataTypes.TEXT },
	resendId: { type: DataTypes.INTEGER },
	userId: {
		type: DataTypes.INTEGER,
		allowNull: false,
	},
	replyUserId: { type: DataTypes.INTEGER }
});

const ReplyComments = sequelize.define("reply_comments", {
	id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
})

const Likes = sequelize.define("likes", {
	id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
	status: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true },
});

const View = sequelize.define("views", {
	id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
});

const Chats = sequelize.define("chats", {
	id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
	name: {type: DataTypes.STRING, allowNull: true},
	is_group: {type: DataTypes.BOOLEAN, defaultValue: false}
});

const ChatParticipants = sequelize.define("chat_participants", {
	id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
})

const Messages = sequelize.define("messages", {
	id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
	content: {type: DataTypes.TEXT, allowNull: false},
	isRead: {type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false}
})

const Notifications = sequelize.define("notifications", {
	id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
	senderId: DataTypes.INTEGER,
	recipientId: DataTypes.INTEGER,
	status: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
	friend_status: {
		type: DataTypes.BOOLEAN,
		allowNull: false,
		defaultValue: false,
	},
});

const UserFriend = sequelize.define("user_friend", {
	id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
});

const UserGroup = sequelize.define("user_group", {
	id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
});

User.hasMany(Project);
Project.belongsTo(User);

User.hasMany(News);
News.belongsTo(User);

Notifications.belongsTo(User, { foreignKey: "senderId", as: "sender" });
Notifications.belongsTo(User, { foreignKey: "recipientId", as: "recipient" });
Notifications.belongsTo(Likes, { foreignKey: "likeId", as: "like" });
Notifications.belongsTo(Comments, { foreignKey: "commentId", as: "comment" });
Notifications.belongsTo(Comments, { foreignKey: "replyCommentId", as: "replyComment" });

Project.hasMany(Comments);
Comments.belongsTo(Project);

News.hasMany(Comments);
Comments.belongsTo(News);

User.hasMany(Comments);
Comments.belongsTo(User, { foreignKey: "userId" });
Comments.belongsTo(User, { as: "userReply", foreignKey: "replyUserId" });

Comments.hasMany(Comments, { as: 'replyes', foreignKey: 'parentId' });

Project.hasMany(Likes);
Likes.belongsTo(Project, { foreignKey: "projectId" });

Project.hasMany(View, { foreignKey: "projectId" });
View.belongsTo(Project);

News.hasMany(Likes);
Likes.belongsTo(News);

News.hasMany(View, { foreignKey: "newsId" });
View.belongsTo(News);

User.hasMany(Likes);
Likes.belongsTo(User);

Comments.hasMany(Likes);
Likes.belongsTo(Comments);

User.hasMany(View, { foreignKey: "userId" });
View.belongsTo(User);

User.belongsToMany(Friend, { through: UserFriend, as: "friends" });

Group.belongsToMany(User, { through: UserGroup });
User.belongsToMany(Group, { through: UserGroup });

Role.hasMany(User, { foreignKey: { defaultValue: 1 } });
User.belongsTo(Role);

User.hasMany(Messages);
Messages.belongsTo(User);

Chats.hasMany(Messages);
Messages.belongsTo(Chats);

Chats.belongsToMany(User, {through: ChatParticipants});
User.belongsToMany(Chats, {through: ChatParticipants});

module.exports = {
	User,
	Friend,
	Group,
	Role,
	Project,
	News,
	Messages,
	Chats,
	ChatParticipants,
	Comments,
	Likes,
	View,
	Notifications,
	UserFriend,
	ReplyComments,
	UserGroup
};
