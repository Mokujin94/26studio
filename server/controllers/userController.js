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
const axios = require("axios");

const { v4: uuidv4 } = require("uuid");
const {
	User,
	Friend,
	Project,
	Group,
	UserFriend,
	UserGroup,
	Chats,
	ChatParticipants,
	ChatMembers,
} = require("../models/models");
const { Op, where } = require("sequelize");
const hasHtmlFile = require("../helpers/hasHtmlFile");
const { isReactProject, findBuildFolder } = require("../helpers/isReactProject");
const { addBaseHref } = require("../helpers/fixIndexHtml");
const { exec, spawn } = require("child_process");
const { getIo } = require("../socket");

const generateJwt = (
	id,
	name,
	full_name,
	email,
	description,
	avatar,
	group,
	roleId,
	lastOnline,
	github_username
) => {
	return jwt.sign(
		{ id, name, full_name, email, description, avatar, group, roleId, lastOnline, github_username },
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
			// 
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

			const newChat = await Chats.create({
				name: `${user.name}'s Chat`
			})

			await ChatMembers.create({
				userId: user.id,
				chatId: newChat.id
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

			const token = generateJwt(
				findUser.id,
				findUser.name,
				findUser.full_name,
				findUser.email,
				findUser.description,
				findUser.avatar,
				findUser.groups[0],
				findUser.roleId,
				findUser.lastOnline,
				findUser.github_username
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
				user.lastOnline,
				user.github_username
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
				user.github_username
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
			const zipFilePath = path.join(uploadPath, zipFile.name);

			// Сохраняем zip-архив на сервере с использованием Promise
			try {
				await new Promise((resolve, reject) => {
					zipFile.mv(zipFilePath, (err) => {
						if (err) reject(err);
						else resolve();
					});
				});
			} catch (err) {
				return res.status(500).send(err);
			}

			const uniqueExtractPath = path.join(extractPath, uuidv4());
			fs.mkdirSync(uniqueExtractPath);

			// Используем adm-zip для более надёжной распаковки
			let zip;
			try {
				zip = new AdmZip(zipFilePath);
			} catch (zipError) {
				console.error('Ошибка чтения ZIP:', zipError);
				fs.unlinkSync(zipFilePath);
				return next(ApiError.badRequest('Ошибка чтения ZIP-архива. Убедитесь, что файл не повреждён.'));
			}

			const zipEntries = zip.getEntries();
			const filePaths = [];
			let normalPath = path.relative(extractPath, uniqueExtractPath);
			let baseUrl = "";

			// Распаковываем архив
			try {
				zip.extractAllTo(uniqueExtractPath, true);
				
				// Получаем список файлов
				zipEntries.forEach((entry) => {
					if (!entry.isDirectory) {
						filePaths.push(entry.entryName);
						
						// Формируем baseUrl из первого файла
						if (!baseUrl) {
							const fileNamePos = entry.entryName.indexOf("/");
							const projectFolder = fileNamePos > 0 ? entry.entryName.substr(0, fileNamePos) : "";
							baseUrl = `${process.env.BASEURL}/${normalPath}/${projectFolder}/`;
						}
					}
				});
			} catch (extractError) {
				console.error('Ошибка распаковки:', extractError);
				fs.unlinkSync(zipFilePath);
				return next(ApiError.badRequest('Ошибка распаковки архива. Убедитесь, что архив корректен.'));
			}

			// Продолжаем обработку
			{
					// Проверяем, есть ли HTML файлы
					const hasHtml = hasHtmlFile(filePaths);
					
					// Проверяем, является ли это React/Vue проектом
					const reactCheck = isReactProject(uniqueExtractPath);
					
					if (hasHtml && !reactCheck.isReact) {
						// Обычный HTML проект - используем старую логику
						res.json({ filePaths, normalPath, baseUrl, isReact: false });
						return;
					}
					
					if (reactCheck.isReact && reactCheck.buildScript) {
						// React/Vue проект - нужна сборка
						console.log(`Обнаружен ${reactCheck.framework} проект, начинаем сборку...`);
						
						const projectRoot = reactCheck.projectRoot;
						const io = getIo();
						const sessionId = req.headers['x-session-id'] || 'default';
						
						// Функция для отправки прогресса
						const sendProgress = (percent, message) => {
							io.emit('buildProgress', { sessionId, percent, message });
						};
						
						sendProgress(5, 'Подготовка к установке зависимостей...');
						
						// Этап 1: npm install (0-50%)
						const installProcess = spawn('npm', ['install', '--legacy-peer-deps'], {
							cwd: projectRoot,
							shell: true
						});
						
						let installProgress = 5;
						installProcess.stdout.on('data', (data) => {
							// Увеличиваем прогресс постепенно
							if (installProgress < 45) {
								installProgress += 2;
								sendProgress(installProgress, 'Установка зависимостей...');
							}
						});
						
						installProcess.stderr.on('data', (data) => {
							// npm выводит много в stderr даже при успешной установке
							if (installProgress < 45) {
								installProgress += 1;
								sendProgress(installProgress, 'Установка зависимостей...');
							}
						});
						
						installProcess.on('close', (installCode) => {
							if (installCode !== 0) {
								console.error('Ошибка npm install, код:', installCode);
								sendProgress(0, 'Ошибка установки зависимостей');
								
								if (hasHtml) {
									res.json({ 
										filePaths, normalPath, baseUrl, 
										isReact: true,
										buildError: 'Сборка не удалась, используются исходные файлы',
										buildSuccess: false
									});
								} else {
									fs.unlinkSync(zipFilePath);
									return next(ApiError.badRequest(
										`Ошибка установки зависимостей. Загрузите уже собранный проект (папку dist/build).`
									));
								}
								return;
							}
							
							sendProgress(50, 'Зависимости установлены. Начинаем сборку...');
							
							// Этап 2: npm run build (50-100%)
							const buildProcess = spawn('npm', ['run', reactCheck.buildScript], {
								cwd: projectRoot,
								shell: true
							});
							
							let buildProgress = 50;
							buildProcess.stdout.on('data', (data) => {
								const output = data.toString();
								if (buildProgress < 95) {
									buildProgress += 3;
									
									// Определяем этап по выводу
									let message = 'Сборка проекта...';
									if (output.includes('Compiling')) message = 'Компиляция...';
									else if (output.includes('Building')) message = 'Сборка...';
									else if (output.includes('Optimizing')) message = 'Оптимизация...';
									else if (output.includes('Bundling')) message = 'Создание бандла...';
									
									sendProgress(buildProgress, message);
								}
							});
							
							buildProcess.stderr.on('data', (data) => {
								if (buildProgress < 95) {
									buildProgress += 1;
									sendProgress(buildProgress, 'Сборка проекта...');
								}
							});
							
							buildProcess.on('close', (buildCode) => {
								if (buildCode !== 0) {
									console.error('Ошибка сборки, код:', buildCode);
									sendProgress(0, 'Ошибка сборки проекта');
									
									if (hasHtml) {
										res.json({ 
											filePaths, normalPath, baseUrl, 
											isReact: true,
											buildError: 'Сборка не удалась, используются исходные файлы',
											buildSuccess: false
										});
									} else {
										fs.unlinkSync(zipFilePath);
										return next(ApiError.badRequest(
											`Ошибка сборки ${reactCheck.framework} проекта. ` +
											`Загрузите уже собранный проект (папку dist/build).`
										));
									}
									return;
								}
								
								sendProgress(98, 'Завершение...');
								console.log('Сборка завершена успешно');
								
								// Ищем папку сборки
								const buildFolder = findBuildFolder(projectRoot);
								
								if (!buildFolder) {
									sendProgress(0, 'Папка сборки не найдена');
									if (hasHtml) {
										res.json({ 
											filePaths, normalPath, baseUrl, 
											isReact: true,
											buildError: 'Папка сборки не найдена',
											buildSuccess: false
										});
									} else {
										fs.unlinkSync(zipFilePath);
										return next(ApiError.badRequest(
											'Сборка завершена, но папка dist/build не найдена.'
										));
									}
									return;
								}
								
								// Формируем новый baseUrl
								const buildFolderName = path.basename(buildFolder);
								const projectFolderName = path.basename(projectRoot);
								const newBaseUrl = `${process.env.BASEURL}/${normalPath}/${projectFolderName}/${buildFolderName}/`;
								
								// Добавляем base href в index.html для корректной работы абсолютных путей
								const indexHtmlPath = path.join(buildFolder, 'index.html');
								const baseHrefPath = `/${normalPath}/${projectFolderName}/${buildFolderName}/`;
								addBaseHref(indexHtmlPath, baseHrefPath);
								
								// Получаем список файлов
								const getBuildFiles = (dir, basePath = '') => {
									const result = [];
									const items = fs.readdirSync(dir);
									for (const item of items) {
										const itemPath = path.join(dir, item);
										const relativePath = basePath ? `${basePath}/${item}` : item;
										if (fs.statSync(itemPath).isDirectory()) {
											result.push(...getBuildFiles(itemPath, relativePath));
										} else {
											result.push(`${projectFolderName}/${buildFolderName}/${relativePath}`);
										}
									}
									return result;
								};
								
								const buildFilePaths = getBuildFiles(buildFolder);
								
								sendProgress(100, 'Готово!');
								
								res.json({ 
									filePaths: buildFilePaths, 
									normalPath, 
									baseUrl: newBaseUrl,
									isReact: true,
									framework: reactCheck.framework,
									buildSuccess: true
								});
							});
						});
					} else if (reactCheck.isReact && !reactCheck.buildScript) {
						// React проект без скрипта сборки - возможно уже собран
						const buildFolder = findBuildFolder(reactCheck.projectRoot || uniqueExtractPath);
						
						if (buildFolder) {
							// Найдена папка сборки
							const buildFolderName = path.basename(buildFolder);
							const projectFolderName = path.basename(reactCheck.projectRoot || uniqueExtractPath);
							const relPath = path.relative(uniqueExtractPath, buildFolder);
							const newBaseUrl = `${process.env.BASEURL}/${normalPath}/${relPath.replace(/\\/g, '/')}/`;
							
							// Добавляем base href в index.html для корректной работы абсолютных путей
							const indexHtmlPath = path.join(buildFolder, 'index.html');
							const baseHrefPath = `/${normalPath}/${relPath.replace(/\\/g, '/')}/`;
							addBaseHref(indexHtmlPath, baseHrefPath);
							
							res.json({ 
								filePaths, 
								normalPath, 
								baseUrl: newBaseUrl,
								isReact: true,
								buildSuccess: true,
								alreadyBuilt: true
							});
						} else if (hasHtml) {
							// Есть HTML файлы - используем их
							res.json({ filePaths, normalPath, baseUrl, isReact: true, buildSuccess: false });
						} else {
							fs.unlinkSync(zipFilePath);
							return next(ApiError.badRequest(
								'React проект без скрипта сборки и без папки dist/build. ' +
								'Пожалуйста, загрузите уже собранный проект.'
							));
						}
					} else if (!hasHtml) {
						// Нет HTML файлов и не React проект
						fs.unlinkSync(zipFilePath);
						return next(ApiError.badRequest("В архиве нет HTML-файлов и это не React/Vue проект"));
					} else {
						// Есть HTML файлы, но не React проект
						res.json({ filePaths, normalPath, baseUrl, isReact: false });
					}
			}
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

	// Получение списка файлов проекта
	async getProjectFiles(req, res, next) {
		try {
			const { projectPath } = req.query;

			if (!projectPath) {
				return res.status(400).send("Project path is missing.");
			}

			let fullPath = path.join(__dirname, "../extracted/", projectPath);

			// Проверяем существует ли путь
			if (!fs.existsSync(fullPath)) {
				return res.status(404).send("Project not found.");
			}

			// Если путь ведёт к файлу, берём его родительскую директорию
			const stat = fs.statSync(fullPath);
			if (!stat.isDirectory()) {
				fullPath = path.dirname(fullPath);
			}

			// Рекурсивно получаем структуру файлов
			const getFilesRecursively = (dir, basePath = "") => {
				const items = fs.readdirSync(dir);
				const result = [];

				for (const item of items) {
					const itemPath = path.join(dir, item);
					const relativePath = basePath ? `${basePath}/${item}` : item;
					const itemStat = fs.statSync(itemPath);

					if (itemStat.isDirectory()) {
						result.push({
							name: item,
							path: relativePath,
							type: "folder",
							children: getFilesRecursively(itemPath, relativePath)
						});
					} else {
						// Определяем расширение файла
						const ext = path.extname(item).toLowerCase().slice(1);
						result.push({
							name: item,
							path: relativePath,
							type: "file",
							extension: ext
						});
					}
				}

				// Сортируем: папки сначала, потом файлы
				return result.sort((a, b) => {
					if (a.type === "folder" && b.type === "file") return -1;
					if (a.type === "file" && b.type === "folder") return 1;
					return a.name.localeCompare(b.name);
				});
			};

			const files = getFilesRecursively(fullPath);
			return res.json(files);
		} catch (error) {
			console.error("Error getting project files:", error);
			next(ApiError.badRequest(error.message));
		}
	}

	// Получение содержимого файла проекта
	async getProjectFileContent(req, res, next) {
		try {
			const { projectPath, filePath } = req.query;

			if (!projectPath || !filePath) {
				return res.status(400).send("Project path or file path is missing.");
			}

			// Определяем базовую директорию проекта
			let basePath = path.join(__dirname, "../extracted/", projectPath);
			
			// Если путь ведёт к файлу, берём его родительскую директорию
			if (fs.existsSync(basePath)) {
				const stat = fs.statSync(basePath);
				if (!stat.isDirectory()) {
					basePath = path.dirname(basePath);
				}
			}

			const fullPath = path.join(basePath, filePath);

			// Проверяем существует ли файл
			if (!fs.existsSync(fullPath)) {
				return res.status(404).send("File not found.");
			}

			// Проверяем что это файл, а не директория
			const stat = fs.statSync(fullPath);
			if (stat.isDirectory()) {
				return res.status(400).send("Path is a directory, not a file.");
			}

			// Определяем тип файла
			const ext = path.extname(filePath).toLowerCase();
			const textExtensions = ['.html', '.css', '.js', '.jsx', '.ts', '.tsx', '.json', '.md', '.txt', '.xml', '.svg', '.scss', '.sass', '.less', '.vue', '.php', '.py', '.rb', '.java', '.c', '.cpp', '.h', '.hpp', '.cs', '.go', '.rs', '.swift', '.kt', '.yaml', '.yml', '.toml', '.ini', '.env', '.gitignore', '.htaccess'];

			// Проверяем, является ли файл текстовым
			if (!textExtensions.includes(ext)) {
				return res.json({ 
					content: null, 
					isBinary: true, 
					message: "Binary file cannot be displayed" 
				});
			}

			const content = fs.readFileSync(fullPath, "utf-8");
			return res.json({ content, isBinary: false });
		} catch (error) {
			console.error("Error getting file content:", error);
			next(ApiError.badRequest(error.message));
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
				user.lastOnline,
				user.github_username
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
				user.lastOnline,
				user.github_username
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
				user.lastOnline,
				user.github_username
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
				user.lastOnline,
				user.github_username
			);
			return res.json({ token });

		} catch (error) {
			next(ApiError.badRequest(error.message));
		}
	}

	// GitHub OAuth
	async githubAuth(req, res, next) {
		try {
			const clientId = process.env.GITHUB_CLIENT_ID;
			const redirectUri = process.env.GITHUB_REDIRECT_URI;
			const githubAuthUrl = `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&scope=user:email`;
			return res.json({ url: githubAuthUrl });
		} catch (error) {
			next(ApiError.badRequest(error.message));
		}
	}

	async githubCallback(req, res, next) {
		try {
			const { code } = req.body;

			if (!code) {
				return next(ApiError.badRequest("Код авторизации не получен"));
			}

			// Получаем access_token от GitHub
			const tokenResponse = await axios.post(
				'https://github.com/login/oauth/access_token',
				{
					client_id: process.env.GITHUB_CLIENT_ID,
					client_secret: process.env.GITHUB_CLIENT_SECRET,
					code,
				},
				{
					headers: {
						Accept: 'application/json',
					},
				}
			);

			const accessToken = tokenResponse.data.access_token;

			if (!accessToken) {
				return next(ApiError.badRequest("Не удалось получить токен от GitHub"));
			}

			// Получаем данные пользователя от GitHub
			const userResponse = await axios.get('https://api.github.com/user', {
				headers: {
					Authorization: `Bearer ${accessToken}`,
				},
			});

			const githubUser = userResponse.data;

			// Получаем email пользователя (может быть приватным)
			const emailsResponse = await axios.get('https://api.github.com/user/emails', {
				headers: {
					Authorization: `Bearer ${accessToken}`,
				},
			});

			const primaryEmail = emailsResponse.data.find(email => email.primary)?.email || githubUser.email;

			if (!primaryEmail) {
				return next(ApiError.badRequest("Не удалось получить email от GitHub"));
			}

			// Проверяем, существует ли пользователь с таким email
			let user = await User.findOne({
				include: {
					model: Group,
					through: UserGroup
				},
				where: { email: primaryEmail }
			});

			if (!user) {
				// Создаём нового пользователя
				const uniqueName = githubUser.login + '_' + Date.now().toString().slice(-4);
				
				// Скачиваем аватар с GitHub
				let fileName = "avatar.jpg";
				if (githubUser.avatar_url) {
					try {
						const avatarResponse = await axios.get(githubUser.avatar_url, { responseType: 'arraybuffer' });
						fileName = uuid.v4() + ".jpg";
						fs.writeFileSync(
							path.resolve(__dirname, "..", "static/avatars", fileName),
							avatarResponse.data
						);
					} catch (err) {
						fileName = "avatar.jpg";
					}
				}

				// Генерируем случайный пароль для OAuth пользователей
				const randomPassword = uuid.v4();
				const hashPassword = await bcrypt.hash(randomPassword, 5);

				user = await User.create({
					name: uniqueName,
					full_name: githubUser.name || githubUser.login,
					email: primaryEmail,
					password: hashPassword,
					description: githubUser.bio || "",
					avatar: fileName,
					roleId: 1, // student по умолчанию
					github_username: githubUser.login,
				});

				// Создаём чат для пользователя
				const newChat = await Chats.create({
					name: `${user.name}'s Chat`
				});

				await ChatMembers.create({
					userId: user.id,
					chatId: newChat.id
				});

				// Добавляем в группу по умолчанию (первую группу)
				const defaultGroup = await Group.findOne();
				if (defaultGroup) {
					await UserGroup.create({
						userId: user.id,
						groupId: defaultGroup.id
					});
				}

				// Перезагружаем пользователя с группами
				user = await User.findOne({
					include: {
						model: Group,
						through: UserGroup
					},
					where: { id: user.id }
				});
			}

			const token = generateJwt(
				user.id,
				user.name,
				user.full_name,
				user.email,
				user.description,
				user.avatar,
				user.groups?.[0] || null,
				user.roleId,
				user.lastOnline,
				user.github_username
			);

			return res.json({ token });
		} catch (error) {
			next(ApiError.badRequest(error.message));
		}
	}

	// Получение репозиториев GitHub пользователя
	async getGithubRepos(req, res, next) {
		try {
			const { username } = req.params;
			
			if (!username) {
				return next(ApiError.badRequest("GitHub username не указан"));
			}

			// Получаем публичные репозитории пользователя с GitHub API
			const reposResponse = await axios.get(
				`https://api.github.com/users/${username}/repos`,
				{
					params: {
						sort: 'updated',
						direction: 'desc',
						per_page: 30
					},
					headers: {
						'Accept': 'application/vnd.github.v3+json',
						'User-Agent': '26studio-app'
					}
				}
			);

			const repos = reposResponse.data.map(repo => ({
				id: repo.id,
				name: repo.name,
				full_name: repo.full_name,
				description: repo.description,
				html_url: repo.html_url,
				homepage: repo.homepage,
				language: repo.language,
				stargazers_count: repo.stargazers_count,
				forks_count: repo.forks_count,
				watchers_count: repo.watchers_count,
				open_issues_count: repo.open_issues_count,
				created_at: repo.created_at,
				updated_at: repo.updated_at,
				pushed_at: repo.pushed_at,
				topics: repo.topics,
				visibility: repo.visibility,
				default_branch: repo.default_branch
			}));

			return res.json(repos);
		} catch (error) {
			if (error.response?.status === 404) {
				return next(ApiError.badRequest("Пользователь GitHub не найден"));
			}
			next(ApiError.badRequest(error.message));
		}
	}

	// Отключение GitHub от аккаунта
	async disconnectGithub(req, res, next) {
		try {
			const { id } = req.params;

			const user = await User.findOne({
				where: { id },
				include: { model: Group, through: UserGroup }
			});

			if (!user) {
				return next(ApiError.badRequest("Пользователь не найден"));
			}

			await user.update({ github_username: null });

			const token = generateJwt(
				user.id,
				user.name,
				user.full_name,
				user.email,
				user.description,
				user.avatar,
				user.groups?.[0] || null,
				user.roleId,
				user.lastOnline,
				null
			);

			return res.json({ token });
		} catch (error) {
			next(ApiError.badRequest(error.message));
		}
	}

	// Привязка GitHub аккаунта к существующему пользователю
	async linkGithubAccount(req, res, next) {
		try {
			const { code, userId } = req.body;

			if (!code || !userId) {
				return next(ApiError.badRequest("Код авторизации или ID пользователя не получен"));
			}

			// Получаем access_token от GitHub
			const tokenResponse = await axios.post(
				'https://github.com/login/oauth/access_token',
				{
					client_id: process.env.GITHUB_CLIENT_ID,
					client_secret: process.env.GITHUB_CLIENT_SECRET,
					code,
				},
				{
					headers: {
						Accept: 'application/json',
					},
				}
			);

			const accessToken = tokenResponse.data.access_token;

			if (!accessToken) {
				return next(ApiError.badRequest("Не удалось получить токен от GitHub"));
			}

			// Получаем данные пользователя от GitHub
			const userResponse = await axios.get('https://api.github.com/user', {
				headers: {
					Authorization: `Bearer ${accessToken}`,
				},
			});

			const githubUser = userResponse.data;

			// Обновляем пользователя с GitHub username
			const user = await User.findOne({
				where: { id: userId },
				include: { model: Group, through: UserGroup }
			});

			if (!user) {
				return next(ApiError.badRequest("Пользователь не найден"));
			}

			await user.update({ github_username: githubUser.login });

			const token = generateJwt(
				user.id,
				user.name,
				user.full_name,
				user.email,
				user.description,
				user.avatar,
				user.groups?.[0] || null,
				user.roleId,
				user.lastOnline,
				user.github_username
			);

			return res.json({ token });
		} catch (error) {
			next(ApiError.badRequest(error.message));
		}
	}
}
module.exports = new UserController();
