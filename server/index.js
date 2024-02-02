require("dotenv").config();
const express = require("express");
const path = require("path");
const { sequelize } = require("./db");
const models = require("./models/models");
const cors = require("cors");
const fileUpload = require("express-fileupload");
const router = require("./routes/index");
const errorHandler = require("./middleware/ErroeHandlingMiddleware");
const http = require("http");
const socketIo = require("socket.io");

const { initSocket } = require("./socket"); // Подключаем функцию инициализации Socket.IO

const PORT = process.env.PORT || 5000;

const app = express();
const httpServer = http.createServer(app);
const io = initSocket(httpServer);

const allowedOrigins = ["https://poetic-halva-67c56b.netlify.app"];

// Включение middleware для обработки CORS с настройками
app.use(
  cors({
    origin: function (origin, callback) {
      callback(null, true);
      console.log(origin)
      console.log(allowedOrigins.includes(origin))
      console.log(!origin || allowedOrigins.includes(origin));
      if (!origin || allowedOrigins.includes(origin)) {
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true,
    optionsSuccessStatus: 204,
    allowedHeaders: "Content-Type,Authorization",
  })
);
// app.use(cors());
app.use(express.json());
app.use(express.static(path.resolve(__dirname, "static/news")));
app.use(express.static(path.resolve(__dirname, "static/avatars")));
app.use(express.static(path.resolve(__dirname, "static/projects")));
app.use(express.static(path.resolve(__dirname, "extracted")));
app.use(fileUpload({}));

// app.use("/api/user/accept_project", (req, res, next) => {
//   res.header(
//     "Access-Control-Allow-Origin",
//     "https://poetic-halva-67c56b.netlify.app"
//   );
//   res.header(
//     "Access-Control-Allow-Methods",
//     "GET, POST, OPTIONS, PUT, PATCH, DELETE"
//   );
//   res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
//   res.header("Access-Control-Allow-Credentials", "true");
//   next();
// });

app.use("/api", router);

app.use(errorHandler);

const start = async () => {
  try {
    await sequelize.authenticate();
    await sequelize
      .sync()
      .then(async () => {
        await models.Role.findOrCreate({ where: { name: "student" } });
        await models.Group.findOrCreate({ where: { name: "ИС 11/9" } });
      })
      .catch((e) => console.log(e));
    // console.log(path.resolve(__dirname, "static"));
    httpServer.listen(PORT, () =>
      console.log(`сервер стартанул на порте ${PORT}`)
    );
  } catch (e) {
    console.log(e);
  }
};

start();
