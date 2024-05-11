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

	let userSockets = [];
	// События подключения и отключения

	io.on("connection", (socket) => {
		console.log("Пользователь подключен");


		socket.on("joinUser", (userId) => {
			!userSockets.some(user => user.userId === userId) &&
				userSockets.push({
					userId,
					socketId: socket.id
				})
			console.log("userSockets", userSockets)
		})

		socket.on("sendMessageRecipient", ({ message, recipientId }) => {
			const user = userSockets.find(user => user.userId === recipientId);
			if (user) io.to(user.socketId).emit("getMessages", message)
		})

		socket.on("sendMessage", ({ message, recipientId }) => {
			const user1 = userSockets.find(user => user.userId === recipientId);
			const user2 = userSockets.find(user => user.userId === message.user.id);

			if (!user1 || !user2) {
				if (!user1) {
					io.to(user2.socketId).emit("lastMessage", message)
					return;
				} else {
					io.to(user1.socketId).emit("lastMessage", message)
					return;
				}
			} else {
				io.to(user1.socketId).emit("lastMessage", message)
				io.to(user2.socketId).emit("lastMessage", message)
			}
		})

		socket.on("onReadMessage", ({ message, recipientId }) => {
			const user = userSockets.find(user => user.userId === recipientId);

			if (!user) return;

			io.to(user.socketId).emit("getReadMessage", message);
		})



















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

		socket.on("replyComment", (comment) => {
			console.log("Отправка ответного комментария : ", comment);
			io.emit("receiveReplyComment", comment);
		});

		socket.on("notification", (notification) => {
			console.log("Отправка уведомления : ", notification);
			io.emit("receiveNotification", notification);
		});

		// Обработка подписки на чат
		socket.on('joinChat', (chatId) => {
			socket.join(`chat_${chatId}`); // Подключение к комнате чата
			// console.log(`User ${socket.id} joined chat ${chatId}`);
		});

		// Обработка выхода из чата
		socket.on('leaveChat', (chatId) => {
			socket.leave(`chat_${chatId}`); // Отключение от комнаты чата
			// console.log(`User ${socket.id} left chat ${chatId}`);
		});

		socket.on("disconnect", () => {
			userSockets = userSockets.filter(user => user.socketId !== socket.id);
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
