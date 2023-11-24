const ApiError = require("../error/ApiError");
const uuid = require("uuid");
const path = require("path");
require("dotenv").config();
const mailer = require("../nodemailer");
const bcrypt = require("bcrypt");
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
} = require("../models/models");
const { Op } = require("sequelize");

const generateJwt = (
  id,
  name,
  full_name,
  email,
  description,
  avatar,
  groupId,
  roleId
) => {
  return jwt.sign(
    { id, name, full_name, email, description, avatar, groupId, roleId },
    process.env.SECRET_KEY,
    {
      expiresIn: "24h",
    }
  );
};

class UserController {
  async checkCondidate(req, res, next) {
    const { name, email } = req.body;
    const condidateName = await User.findOne({ where: { name } });
    const condidateMail = await User.findOne({ where: { email } });
    if (condidateName && condidateMail) {
      return next(
        ApiError.badRequest("Пользовательно с таким ником и почтой существуют")
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
  }
  async generateCode(req, res, next) {
    const { email, code } = req.body;
    // console.log(code);
    const message = {
      to: email,
      subject: "Код подтверждения аккаунта 26Studio",
      text: `Ваш код - ${code}`,
    };
    mailer(message);
    return res.json(code);
  }
  async registration(req, res, next) {
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

  async getProfileUser(req, res, next) {
    const { id } = req.params;
    const user = await User.findOne({
      where: { id },
    });
    if (!user) {
      return next(ApiError.internal("Пользователь не найден"));
    }
    return res.json(user);
  }

  async getOneUser(req, res, next) {
    const { id } = req.params;
    const user = await User.findOne({
      where: { id },
    });
    return res.json(user);
  }

  async getAll(req, res, next) {
    const { groupId } = req.query;
    const user = await User.findAll({
      where: { group_status: false, groupId },
    });
    return res.json(user);
  }

  async searchUsersByName(req, res) {
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
        groupId,
      },
    });
    return res.json(user);
  }

  async getUsersByGroupStatus(req, res) {
    const { groupId, group_status } = req.query;

    const user = await User.findAll({
      where: {
        groupId,
        group_status,
      },
    });
    return res.json(user);
  }

  async getAllTutors(req, res) {
    const user = await User.findAll({
      where: {
        roleId: 2,
      },
    });
    return res.json(user);
  }

  async uploadProject(req, res) {
    const uploadPath = path.join(__dirname, "..", "uploads");
    const extractPath = path.join(__dirname, "..", "extracted");

    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath);
    }

    if (!fs.existsSync(extractPath)) {
      fs.mkdirSync(extractPath);
    }

    if (!req.files || Object.keys(req.files).length === 0) {
      return res.status(400).send("No files were uploaded.");
    }

    const { projectFile } = req.files;
    const maxFileSize = 100 * 1024 * 1024; // 100 МБ в байтах
    if (projectFile.size > maxFileSize) {
      return res
        .status(400)
        .send("File size exceeds the allowed limit (100 MB).");
    }

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
        console.log(baseUrl);
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
          const content = buffer.toString("utf-8");
          fs.writeFileSync(entryPath, content, "utf-8");
        }

        // Пропускаем содержимое файла
        entry.autodrain();
      });

      extractStream.on("finish", () => {
        // Выводим список относительных путей файлов
        console.log("Files in the archive:", filePaths);

        res.json({ filePaths, normalPath, baseUrl });
      });

      extractStream.on("error", (err) => {
        console.error("Error during extraction:", err);
        res.status(500).send("Error during extraction");
      });
    });
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
      console.log(fullPath);
      res.sendFile(fullPath);
    } catch (error) {
      console.error("Error during project view:", error);
      res.status(500).send("Error during project view");
    }
  }
}
module.exports = new UserController();
