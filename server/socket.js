const socketIo = require("socket.io");
const cors = require("cors");

let io;

function initSocket(httpServer) {
  io = socketIo(httpServer, {
    cors: {
      origin: "http://localhost:3000", // Укажите адрес вашего клиентского приложения
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    console.log("Пользователь подключен");

    socket.on("disconnect", () => {
      console.log("Пользователь отключен");
    });

    socket.on("sendCommentsToClients", (comments) => {
      console.log("Отправка комментариев всем клиентам");
      io.emit("receiveCommentsFromServer", comments);
    });

    socket.on("newComment", (comment) => {
      console.log("Отправка уведомления о новом комментарии : ", comment);
      io.emit("receiveNewComment", comment);
    });
  });

  return io;
}

function getIo() {
  if (!io) {
    throw new Error("Socket.IO is not initialized");
  }
  return io;
}

module.exports = { initSocket, getIo };
