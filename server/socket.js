const socketIo = require("socket.io");
const cors = require("cors");

let io;

function initSocket(httpServer) {
  io = socketIo(httpServer, {
    cors: {
      origin: process.env.CLIENTURL, // Укажите ваш фронтенд-адрес
      // origin: "http://localhost:3000", // Укажите ваш фронтенд-адрес
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

    socket.on("sendCommentsNewsToClients", (comments) => {
      console.log("Отправка комментариев всем клиентам");
      io.emit("receiveCommentsNewsFromServer", comments);
    });

    socket.on("sendLikesToClients", (comments) => {
      console.log("Отправка комментариев всем клиентам");
      io.emit("receiveCommentsFromServer", comments);
    });

    socket.on("sendLikesNewsToClients", (comments) => {
      console.log("Отправка комментариев всем клиентам");
      io.emit("receiveCommentsFromServer", comments);
    });

    socket.on("sendViewsToClients", (comments) => {
      console.log("Отправка просмотров всем клиентам");
      io.emit("receiveViewsFromServer", comments);
    });

    socket.on("sendViewsNewsToClients", (comments) => {
      console.log("Отправка просмотров всем клиентам");
      io.emit("receiveViewsFromServer", comments);
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
