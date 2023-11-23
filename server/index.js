require("dotenv").config();
const express = require("express");
const path = require("path");
const sequelize = require("./db");
const models = require("./models/models");
const cors = require("cors");
const fileUpload = require("express-fileupload");
const router = require("./routes/index");
const errorHandler = require("./middleware/ErroeHandlingMiddleware");

const PORT = process.env.PORT || 5000;

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(path.resolve(__dirname, "static/news")));
app.use(express.static(path.resolve(__dirname, "static/avatars")));
app.use(express.static(path.resolve(__dirname, "static/projects")));
app.use(express.static(path.resolve(__dirname, "extracted")));
app.use(fileUpload({}));
app.use("/api", router);

app.use(errorHandler);

const start = async () => {
  try {
    await sequelize.authenticate();
    await sequelize.sync();
    console.log(path.resolve(__dirname, "static"));
    app.listen(PORT, () => console.log(`сервер стартанул на порте ${PORT}`));
  } catch (e) {
    console.log(e);
  }
};

start();
