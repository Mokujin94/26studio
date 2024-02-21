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



const corsOptions = {
	origin: function (origin, callback) {
		if (origin === "https://poetic-halva-67c56b.netlify.app") {
			// Разрешить доступ для указанного URL
			callback(null, true);
		} else {
			// Запретить доступ для всех остальных
			callback(new Error("Not allowed by CORS"));
		}
	},
	methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
	optionsSuccessStatus: 204,
};

app.use(cors(corsOptions));
// app.use(cors());
app.use(express.json());
app.use(express.static(path.resolve(__dirname, "static/news")));
app.use(express.static(path.resolve(__dirname, "static/avatars")));
app.use(express.static(path.resolve(__dirname, "static/projects")));
app.use(express.static(path.resolve(__dirname, "extracted")));
app.use(fileUpload({}));



app.use("/api", router);



app.use(errorHandler);

const httpServer = http.createServer(app);
const io = initSocket(httpServer);


const start = async () => {
	try {
		await sequelize.authenticate();
		await sequelize
			.sync()
			.then(async () => {
				await models.Role.findOrCreate({ where: { name: "student" } });
				await models.Group.findOrCreate({ where: { name: "ИС 11/9" } });
				await models.Group.findOrCreate({ where: { name: "ИС 12/9" } });
				await models.Group.findOrCreate({ where: { name: "ИС 13/9" } });
				await models.Group.findOrCreate({ where: { name: "ИС 21/9" } });
				await models.Group.findOrCreate({ where: { name: "ИС 22/9" } });
				await models.Group.findOrCreate({ where: { name: "ИС 23/9" } });
				await models.Group.findOrCreate({ where: { name: "ИС 31/9" } });
				await models.Group.findOrCreate({ where: { name: "ИС 32/9" } });
				await models.Group.findOrCreate({ where: { name: "ИС 33/9" } });
				await models.Group.findOrCreate({ where: { name: "ИС 41/9" } });
				await models.Group.findOrCreate({ where: { name: "ИС 42/9" } });
				await models.Group.findOrCreate({ where: { name: "ИС 43/9" } });
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
