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
					io.to(user1.socketId).emit("incReadMessege", message)
					return;
				}
			} else if (user1 && user2) {
				io.to(user1.socketId).emit("lastMessage", message)
				io.to(user1.socketId).emit("incReadMessege", message)
				io.to(user2.socketId).emit("lastMessage", message)
			}
		})

		socket.on("onWriting", ({ chatId, recipientId, isWriting }) => {
			const user = userSockets.find(user => user.userId === recipientId);
			if (!user) return;
			console.log(user)
			io.to(user.socketId).emit("getWriting", { chatId, isWriting })
		})

		socket.on("onDraft", ({text, recipientId, chatId}) => {
			const user = userSockets.find(user => user.userId === recipientId);
			if (!user) return;
			io.to(user.socketId).emit("getDraft", { text, chatId })

		})

		socket.on("onReadMessage", ({ message, recipientId, senderId }) => {
			const user = userSockets.find(user => user.userId === recipientId);


			if (!user) return;

			io.to(user.socketId).emit("getReadMessage", message);
		})

		socket.on("onNotReadMessage", ({ message, recipientId }) => {
			const user = userSockets.find(user => user.userId === recipientId);


			if (!user) return;

			io.to(user.socketId).emit("getNotReadMessage", message);
		})

















		socket.on("sendCommentsToClients", (comments) => {

			io.emit("receiveCommentsFromServer", comments);
		});

		socket.on("sendCommentsNewsToClients", (comments) => {

			io.emit("receiveCommentsNewsFromServer", comments);
		});

		socket.on("sendLikesToClients", (comments) => {

			io.emit("receiveCommentsFromServer", comments);
		});

		socket.on("sendLikesNewsToClients", (comments) => {

			io.emit("receiveCommentsFromServer", comments);
		});

		socket.on("sendViewsToClients", (comments) => {

			io.emit("receiveViewsFromServer", comments);
		});

		socket.on("sendViewsNewsToClients", (comments) => {

			io.emit("receiveViewsFromServer", comments);
		});

		socket.on("newComment", (comment) => {

			io.emit("receiveNewComment", comment);
		});

		socket.on("replyComment", (comment) => {

			io.emit("receiveReplyComment", comment);
		});

		socket.on("notification", (notification) => {

			io.emit("receiveNotification", notification);
		});

		// Обработка подписки на чат
		socket.on('joinChat', (chatId) => {
			socket.join(`chat_${chatId}`); // Подключение к комнате чата
			// 
		});

		// Обработка выхода из чата
		socket.on('leaveChat', (chatId) => {
			socket.leave(`chat_${chatId}`); // Отключение от комнаты чата
			// 
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
