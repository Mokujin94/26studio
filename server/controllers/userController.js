const ApiError = require("../error/ApiError");
const uuid = require("uuid");
const path = require("path");
require("dotenv").config();
const mailer = require("../nodemailer");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const AdmZip = require("adm-zip");
const fs = require("fs");
const unzipper = require("unzipper");

const { v4: uuidv4 } = require("uuid");
const {
	User,
	Friend,
	UserAchivment,
	GettingAchivment,
	Project,
	Group,
	UserFriend,
	UserGroup,
} = require("../models/models");
const { Op, where } = require("sequelize");
const hasHtmlFile = require("../helpers/hasHtmlFile");

const generateJwt = (
	id,
	name,
	full_name,
	email,
	description,
	avatar,
	group,
	roleId,
	lastOnline
) => {
	return jwt.sign(
		{ id, name, full_name, email, description, avatar, group, roleId, lastOnline },
		process.env.SECRET_KEY,
		{
			expiresIn: "14d",
		}
	);
};

class UserController {
	async checkCondidate(req, res, next) {
		try {
			const { name, email } = req.body;
			const condidateName = await User.findOne({ where: { name } });
			const condidateMail = await User.findOne({ where: { email } });
			if (condidateName && condidateMail) {
				return next(
					ApiError.badRequest(
						"Пользовательно с таким ником и почтой существуют"
					)
				);
			}
			if (condidateName) {
				return next(
					ApiError.badRequest("Пользовательно с таким ником существует")
				);
			}
			if (condidateMail) {
				return next(
					ApiError.badRequest("Пользовательно с такой почтой существует")
				);
			}
			return res.json();
		} catch (error) {
			next(ApiError.badRequest(error.message));
		}
	}

	async getUserByEmail(req, res, next) {
		try {
			const { email } = req.query;
			const condidateMail = await User.findOne({ where: { email } });
			if (!condidateMail) {
				return next(
					ApiError.badRequest("Пользовательно с такой почтой не существует")
				);
			}
			return res.json(condidateMail);
		} catch (error) {
			next(ApiError.badRequest(error.message));
		}
	}

	async generateCode(req, res, next) {
		try {
			const { email, code } = req.body;
			// console.log(code);
			const message = {
				to: email,
				subject: "Код подтверждения аккаунта 26Studio",
				text: `Ваш код - ${code}`,
			};
			mailer(message);
			return res.json(code);
		} catch (error) {
			next(ApiError.badRequest(error.message));
		}
	}
	async registration(req, res, next) {
		try {
			const { name, full_name, email, password, description, groupId, roleId } =
				req.body;

			let fileName;

			if (!email || !password) {
				return next(ApiError.badRequest("Неверная почта или пароль"));
			}
			const condidate = await User.findOne({ where: { email } });
			if (condidate) {
				return next(
					ApiError.badRequest("Пользовательно с такой почтой существует")
				);
			}
			if (req.files) {
				fileName = uuid.v4() + ".jpg";
				const { avatar } = req.files;
				avatar.mv(path.resolve(__dirname, "..", "static/avatars", fileName));
			} else {
				fileName = "avatar.jpg";
			}
			const hashPassword = await bcrypt.hash(password, 5);
			const user = await User.create({
				name,
				full_name,
				email,
				password: hashPassword,
				description,
				avatar: fileName,
				roleId,
			});

			const userGroup = await UserGroup.create({
				userId: user.id,
				groupId: groupId
			})

			const findUser = await User.findOne({
				include: {
					model: Group,
					through: UserGroup
				},
				where: { id: user.id }
			})
			const achivment = await UserAchivment.create({ userId: user.id });
			const gettingAchivment = await GettingAchivment.create({
				userId: user.id,
			});
			const token = generateJwt(
				findUser.id,
				findUser.name,
				findUser.full_name,
				findUser.email,
				findUser.description,
				findUser.avatar,
				findUser.groups[0],
				findUser.roleId,
				findUser.lastOnline
			);
			return res.json({ token });
		} catch (error) {
			next(ApiError.badRequest(error.message));
		}
	}

	async login(req, res, next) {
		try {
			const { email, password } = req.body;
			const user = await User.findOne({
				include: {
					model: Group,
					through: UserGroup
				},
				where: { email }
			});
			if (!user) {
				return next(ApiError.internal("Пользователь с такой почтой не найден"));
			}
			let comparePassword = bcrypt.compareSync(password, user.password);
			if (!comparePassword) {
				return next(ApiError.internal("Неверная почта или пароль"));
			}
			const token = generateJwt(
				user.id,
				user.name,
				user.full_name,
				user.email,
				user.description,
				user.avatar,
				user.groups[0],
				user.roleId,
				user.lastOnline
			);
			return res.json({ token });
		} catch (error) {
			next(ApiError.badRequest(error.message));
		}
	}

	async check(req, res, next) {

		try {
			const user = await User.findOne({
				include: [Group],
				where: { id: req.user.id },
			})
			console.log(user)
			const token = generateJwt(
				user.id,
				user.name,
				user.full_name,
				user.email,
				user.description,
				user.avatar,
				user.groups[0],
				user.roleId,
				user.lastOnline,
			);
			return res.json({ token });
		} catch (error) {
			next(ApiError.badRequest(error.message));
		}
	}

	async getProfileUser(req, res, next) {
		try {
			const { id } = req.params;
			const user = await User.findOne({
				include: [
					{
						model: Group,
						through: UserGroup
					},
					{
						model: Friend,
						through: UserFriend,
						as: "friends",
					},
				],
				where: { id },
			});
			if (!user) {
				return next(ApiError.internal("Пользователь не найден"));
			}
			return res.json(user);
		} catch (error) {
			next(ApiError.badRequest(error.message));
		}
	}

	async getOneUser(req, res, next) {
		try {
			const { id } = req.params;
			const user = await User.findOne({
				include: [{
					model: Group,
					through: UserGroup
				}, Friend],
				where: { id },
			});
			return res.json(user);
		} catch (error) {
			next(ApiError.badRequest(error.message));
		}
	}

	async searchUsersByName(req, res, next) {
		try {
			const { search, groupId, group_status } = req.query;

			const user = await User.findAll({
				where: {
					[Op.or]: {
						name: {
							[Op.iLike]: "%" + search + "%",
						},
						full_name: {
							[Op.iLike]: "%" + search + "%",
						},
					},
					group_status,
				},
				include: {
					model: Group,
					through: UserGroup,
					where: { id: groupId }
				}
			});
			return res.json(user);
		} catch (error) {
			next(ApiError.badRequest(error.message));
		}
	}

	async getUsersByGroupStatus(req, res, next) {
		try {
			const { groupId, group_status } = req.query;

			const user = await User.findAll({
				where: {
					group_status,
				},
				include: {
					model: Group,
					through: UserGroup,
					where: { id: groupId }
				}
			});
			return res.json(user);
		} catch (error) {
			next(ApiError.badRequest(error.message));
		}
	}

	async getAllTutors(req, res, next) {
		try {
			const user = await User.findAll({
				where: {
					roleId: 2,
				},
			});
			return res.json(user);
		} catch (error) {
			next(ApiError.badRequest(error.message));
		}
	}



	async uploadProject(req, res, next) {
		try {

			const uploadPath = path.join(__dirname, "..", "uploads");
			const extractPath = path.join(__dirname, "..", "extracted");

			if (!fs.existsSync(uploadPath)) {
				fs.mkdirSync(uploadPath);
			}
			console.log(req.files);

			if (!fs.existsSync(extractPath)) {
				fs.mkdirSync(extractPath);
			}


			if (!req.files) {
				return res.status(400).send("No files were uploaded.");
			}

			const { projectFile } = req.files;
			const maxFileSize = 100 * 1024 * 1024; // 100 МБ в байтах
			// if (projectFile.size > maxFileSize) {
			// 	return res
			// 		.status(400)
			// 		.send("File size exceeds the allowed limit (100 MB).");
			// }

			const zipFile = projectFile;

			// Сохраняем zip-архив на сервере
			zipFile.mv(path.join(uploadPath, zipFile.name), (err) => {
				if (err) {
					return res.status(500).send(err);
				}

				const zipFilePath = path.join(uploadPath, zipFile.name);
				const uniqueExtractPath = path.join(extractPath, uuidv4());

				fs.mkdirSync(uniqueExtractPath);

				// Используем потоки для разархивации
				const readStream = fs.createReadStream(zipFilePath);
				const extractStream = readStream.pipe(unzipper.Parse());

				const filePaths = [];
				let normalPath = "";
				let baseUrl = "";

				extractStream.on("entry", async (entry) => {
					const entryPath = path.join(uniqueExtractPath, entry.path);
					// Добавляем относительный путь файла в массив
					const relativePath = path.relative(uniqueExtractPath, entryPath);
					normalPath = path.relative(extractPath, uniqueExtractPath);
					const fileNamePos = entry.path.indexOf("/");
					baseUrl = path.join(
						process.env.BASEURL + "/",
						normalPath + "/",
						entry.path.substr(0, fileNamePos) + "/"
					);
					filePaths.push(relativePath);

					// Создаем уникальную папку для файла (включая все предшествующие директории)
					if (entry.type === "Directory") {
						fs.mkdirSync(entryPath, { recursive: true });
					} else {
						// Создаем все предшествующие директории
						const dirname = path.dirname(entryPath);
						fs.mkdirSync(dirname, { recursive: true });

						// Читаем буфер и преобразуем его в строку
						const buffer = await entry.buffer();
						fs.writeFileSync(entryPath, buffer);
					}

					// Пропускаем содержимое файла
					entry.autodrain();
				});

				extractStream.on("finish", () => {
					if (!hasHtmlFile(filePaths)) {
						// Удаляем zip-архив с сервера
						const zipFilePath = path.join(uploadPath, zipFile.name);
						fs.unlinkSync(zipFilePath);

						return next(ApiError.badRequest("В архиве нет HTML-файлов"));
					}
					// Выводим список относительных путей файлов
					console.log("Files in the archive:", filePaths);
					res.json({ filePaths, normalPath, baseUrl });
				});

				extractStream.on("error", (err) => {
					console.error("Error during extraction:", err);
					res.status(500).send("Error during extractions");
				});
			});
		} catch (error) {
			next(ApiError.badRequest(error.message));
		}
	}

	async sendProjectViewer(req, res) {
		try {
			const { filePath } = req.query;

			if (!filePath) {
				return res.status(400).send("File path is missing.");
			}

			// Формируем полный путь к файлу, включая уникальную папку
			const fullPath = path.join(__dirname, "../extracted/", filePath);

			// Отправляем файл клиенту
			res.sendFile(fullPath);
		} catch (error) {
			console.error("Error during project view:", error);
			res.status(500).send("Error during project view");
		}
	}

	async uploadFinishedProject(req, res, next) {
		const {
			name,
			description,
			path_from_project,
			baseURL,
			is_private,
			is_private_comments,
			userId,
		} = req.body;
		try {

			const staticProjects = path.join(__dirname, "..", "static", "projects");

			if (!fs.existsSync(staticProjects)) {
				fs.mkdirSync(staticProjects);
			}

			const previewFile = uuid.v4() + ".jpg";
			const { preview } = req.files;
			preview.mv(path.resolve(__dirname, "..", "static/projects", previewFile));

			const project = await Project.create({
				name,
				description,
				path_from_project,
				baseURL,
				preview: previewFile,
				is_private,
				is_private_comments,
				userId,
			});

			return res.json(project);
		} catch (error) {
			next(ApiError.badRequest(error.message));
		}
	}

	async updateAvatar(req, res, next) {
		try {
			const { id } = req.body;
			let fileName;
			const user = await User.findOne({ where: { id }, include: { model: Group, through: UserGroup } });
			if (req.files) {
				fileName = uuid.v4() + ".jpg";
				const { avatar } = req.files;
				avatar.mv(path.resolve(__dirname, "..", "static/avatars", fileName));
			} else {
				fileName = "avatar.jpg";
			}
			await user.update({ avatar: fileName });
			const token = generateJwt(
				user.id,
				user.name,
				user.full_name,
				user.email,
				user.description,
				user.avatar,
				user.groups[0],
				user.roleId,
				user.lastOnline
			);
			return res.json({ token });
		} catch (error) {
			next(ApiError.badRequest(error.message));
		}
	}

	async update(req, res, next) {
		const { id } = req.params;
		const { name, full_name, about, email, old_password, password, groupId } = req.body;

		let user;
		let fileName;

		if (!id) {
			next(ApiError.badRequest({ error: "Interal Server Error" }))
		}

		try {
			user = await User.findOne({
				include: [{
					model: Group,
					through: UserGroup
				}],
				where: { id }
			})

			const groupUser = await UserGroup.findOne({
				where: { userId: id, groupId: user.groups[0].id }
			})

			let updateFields = {}; // Объект для хранения обновляемых полей
			let updateGroupUser = {}; // Объект для хранения обновляемых полей

			// Проверяем, передано ли поле в req.body, и если да, добавляем его в объект обновления
			if (name) updateFields.name = name;
			if (full_name) updateFields.full_name = full_name;
			updateFields.description = about;
			if (email) updateFields.email = email;
			if (password || old_password) {
				if (!password) {
					return next(ApiError.badRequest("Введите новый пароль"))
				}
				let comparePassword = bcrypt.compareSync(old_password, user.password);
				if (!comparePassword) {
					return next(ApiError.badRequest("Неверный пароль"))
				}
				const hashPassword = await bcrypt.hash(password, 5);
				updateFields.password = hashPassword;
			}
			if (groupId) {
				if (groupId !== user.groups[0].id) {
					updateFields.group_status = false;
					updateGroupUser.groupId = groupId;
				}
			}

			await user.update(updateFields);
			await groupUser.update(updateGroupUser);
			const token = generateJwt(
				user.id,
				user.name,
				user.full_name,
				user.email,
				user.description,
				user.avatar,
				user.groups[0],
				user.roleId,
				user.lastOnline
			);
			return res.json({ token });
		} catch (error) {
			next(ApiError.badRequest(error.message));
		}
	}

	async recoveryPassword(req, res, next) {
		try {
			const { email, new_password } = req.body;
			const user = await User.findOne({ where: { email }, include: { model: Group, through: UserGroup } })
			if (!user) {
				return next(
					ApiError.badRequest("Пользовательно с такой почтой не существует")
				);
			}
			const hashNewPassword = await bcrypt.hash(new_password, 5);
			await user.update({ password: hashNewPassword })
			const token = generateJwt(
				user.id,
				user.name,
				user.full_name,
				user.email,
				user.description,
				user.avatar,
				user.groups[0],
				user.roleId,
				user.lastOnline
			);
			return res.json({ token });
		} catch (error) {
			next(ApiError.badRequest(error.message));
		}
	}

	async checkOnline(req, res, next) {
		const { id } = req.params;
		if (!id) return next(ApiError.internal({ error: 'Internal server error' }))
		try {
			// user.lastOnline = new Date(); // изменяем значение поля lastOnline
			const findUser = await User.findOne({
				where: {
					id
				},
				include: { model: Group, through: UserGroup }
			})
			if (!findUser) {
				return next(ApiError.badRequest("Не авторизован"))
			}

			const user = await findUser.update({ lastOnline: new Date() }); // сохраняем изменения в базе данных
			const token = generateJwt(
				user.id,
				user.name,
				user.full_name,
				user.email,
				user.description,
				user.avatar,
				user.groups[0],
				user.roleId,
				user.lastOnline
			);
			return res.json({ token });

		} catch (error) {
			next(ApiError.badRequest(error.message));
		}
	}
}
module.exports = new UserController();
