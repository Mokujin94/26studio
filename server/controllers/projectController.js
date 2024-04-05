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
const { sequelize } = require("../db");

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

	async getAll(req, res, next) {
		try {
			let { limit, page, filter } = req.query;
			page = page || 1;
			limit = limit || 10;
			filter = filter || "0";
			let offset = page * limit - limit;
			let projects;

			const totalCount = await Project.count();
			if (filter === "0") {
				projects = await Project.findAndCountAll({
					// attributes: Object.keys(Project.rawAttributes),
					include: [
						{
							model: Likes,
							where: { status: true },
							required: false,
						},
						Comments,
						User,
						View,
					],
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
					include: [
						{
							model: Likes,
							where: { status: true },
							required: false,
						},
						Comments,
						User,
						View,
					],
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
					include: [
						{
							model: Likes,
							where: { status: true },
							required: false,
						},
						Comments,
						User,
						View,
					],
					order: [["createdAt", "DESC"]], // Сортировка по полю createdAt в убывающем порядке
					offset,
					limit,
					where: {
						is_private: false,
					},
				});
			}
			return res.json({ count: totalCount, rows: projects.rows });
		} catch (error) {
			next(ApiError.badRequest(error.message));
		}
	}

	async getOne(req, res, next) {
		try {
			const { id } = req.params;
			const project = await Project.findOne({
				where: { id },
				include: [
					User,
					{
						model: Likes,
						where: { status: true },
						required: false,
					},
					View,
				],
			});

			return res.json(project);
		} catch (error) {
			next(ApiError.badRequest(error.message));
		}
	}

	async deleteOne(req, res, next) {
		try {
			const { id } = req.params;
			const project = await Project.destroy({
				where: { id }
			});

			if (!project) {
				return res.status(404).json({ error: 'Проект не найден' });
			}

			return res.json(project);
		} catch (error) {
			next(ApiError.badRequest(error.message));
		}
	}

	async getAllUser(req, res, next) {
		try {
			const { id } = req.params;
			let projects = await User.findOne({
				include: [
					{
						model: Project,
						include: [Likes, Comments, View, User],
					},
				],
				where: { id },
			});
			return res.json(projects);
		} catch (error) {
			next(ApiError.badRequest(error.message));
		}
	}

	async condidateLike(req, res, next) {
		try {
			const { projectId, userId } = req.query;

			if (!userId) {
				return next(ApiError.internal("Не авторизован"));
			}

			const condidate = await Likes.findAll({
				where: { userId, projectId, status: true },
			});

			return res.json(condidate);
		} catch (error) {
			next(ApiError.badRequest(error.message));
		}
	}

	async setLike(req, res, next) {
		const { projectId, userId } = req.body;
		const io = getIo();
		let likes;

		if (!userId) {
			return next(ApiError.internal("Не авторизован"));
		}

		const t = await sequelize.transaction();

		try {
			const checkLikeOnProject = await Likes.findOne({
				where: { projectId, userId, status: false },
				transaction: t,
			});

			const userProject = await Project.findOne({
				where: { id: projectId },
				include: [User],
				transaction: t,
			});

			if (checkLikeOnProject) {
				likes = await Likes.findOne({
					where: { projectId, userId, status: false },
					transaction: t,
				});
				await likes.update({ status: true }, { transaction: t });
			} else {
				likes = await Likes.create(
					{
						projectId,
						userId,
						status: true,
					},
					{ transaction: t }
				);

				const notification = await Notifications.create(
					{
						likeId: likes.id,
						senderId: userId,
						recipientId: userProject.user.id,
					},
					{ transaction: t }
				);

				const sendNotification = await Notifications.findOne({
					where: { id: notification.id },
					include: [
						{
							model: Likes,
							as: "like",
						},
						{
							model: Comments,
							as: "comment",
						},
						{
							model: Comments,
							as: "replyComment",
						},
						{
							model: User,
							as: "sender",
						},
						{
							model: User,
							as: "recipient",
						},
					],
					transaction: t,
				});
				io.emit("notification", sendNotification);
			}

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
				transaction: t,
			});

			io.emit("sendLikesToClients", allLikes);
			await t.commit();

			return res.json(likes);
		} catch (error) {
			await t.rollback();
			next(ApiError.badRequest(error.message));
		}
	}

	async deleteLike(req, res, next) {
		const { projectId, userId } = req.body;
		let likes;

		if (!userId) {
			return next(ApiError.internal("Не авторизован: " + userId));
		}

		const t = await sequelize.transaction();

		try {
			likes = await Likes.findOne({
				where: { projectId, userId, status: true },
				transaction: t,
			});

			if (likes) {
				await likes.update({ status: false }, { transaction: t });

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
					transaction: t,
				});

				const io = getIo();
				io.emit("sendLikesToClients", allLikes);
			}

			await t.commit();

			return res.json(likes);
		} catch (error) {
			await t.rollback();
			next(ApiError.badRequest(error.message));
		}
	}

	async searchProject(req, res, next) {
		try {
			let { search, limit, page, filter } = req.query;
			page = page || 1;
			limit = limit || 15;
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
					include: [
						{
							model: Likes,
							where: { status: true },
							required: false,
						},
						Comments,
						User,
						View,
					],
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
					include: [
						{
							model: Likes,
							where: { status: true },
							required: false,
						},
						Comments,
						User,
						View,
					],
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
					include: [
						{
							model: Likes,
							where: { status: true },
							required: false,
						},
						Comments,
						User,
						View,
					],
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
		} catch (error) {
			next(ApiError.badRequest(error.message));
		}
	}
}

module.exports = new ProjectController();
