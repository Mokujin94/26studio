const { Op } = require("sequelize");
const ApiError = require("../error/ApiError");
const { User, Project, News, Group, UserGroup } = require("../models/models");
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
				include: [{
					model: Group,
					through: UserGroup
				}],
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
				order: [
					['id', 'ASC'] // Сортировка по возрастанию идентификатора
				],
				include: {
					model: User,
					through: UserGroup,
					where: { group_status: true },
					required: false,
				},
				required: false,
			});

			res.json({ users, projects, groups });
		} catch (error) {
			next(ApiError.badRequest(error.message));
		}
	}
}

module.exports = new SearchController();
