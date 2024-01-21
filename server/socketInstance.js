// server/socketInstance.js
const socketIo = require("socket.io");
const http = require("http");
const app = require("./index"); // Подключите ваш Express-сервер

// const server = http.createServer(app);
const io = socketIo(app, {
  cors: {
    origin: "https://poetic-halva-67c56b.netlify.app/", // Укажите ваш фронтенд-адрес
    methods: ["GET", "POST"],
  },
  path: "/socket.io", // Укажите путь для Socket.IO
});

io.on("connection", (socket) => {
  console.log("A user connected");

  // Обработчик события создания комментария
  socket.on("commentCreated", (comment) => {
    // Рассылаем комментарий всем подключенным клиентам
    io.emit("commentCreated", comment);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
});

module.exports = { io };
