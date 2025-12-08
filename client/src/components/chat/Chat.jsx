import { useContext, useEffect, useState } from "react";
import style from "./chat.module.scss";
import { observer } from "mobx-react-lite";
import { Context } from "../..";
import { Link, useLocation, useParams } from "react-router-dom";
import { MESSENGER_ROUTE } from "../../utils/consts";
import useTimeFormatter from "../../hooks/useTimeFormatter";
import { CSSTransition } from "react-transition-group";
import notificationAudio from "../../resource/audio/notification.mp3";

const Chat = observer(({ chat, hash }) => {
	const { user } = useContext(Context);
	const [otherUserData, setOtherUserData] = useState({});
	const [userData, setUserData] = useState({});
	const [lastMessage, setLastMessage] = useState({});
	const [notReadMessages, setNotReadMessages] = useState([]);
	const dedupeMessages = (arr) => {
		const seen = new Set();
		return arr.filter((m) => {
			if (seen.has(m.id)) return false;
			seen.add(m.id);
			return true;
		});
	};

	const [isWriting, setIsWriting] = useState(false);
	const [draft, setDraft] = useState("");
	const location = useLocation();
	const hashGroup = Number(location.hash.replace("#chatGroup=", ""));

	// Функция для обработки файлов в сообщении
	const processMessageFiles = (msg) => {
		if (!msg) return msg;
		if (msg.files && msg.files.length) {
			return {
				...msg,
				files: msg.files.map((f) =>
					f.startsWith("http") ? f : process.env.REACT_APP_API_URL + "/" + f
				),
			};
		}
		return msg;
	};

	useEffect(() => {
		console.log(chat);
		if (chat.messages.length) {
			const rawMsg = chat.messages[0][0] || chat.messages[0];
			setLastMessage(processMessageFiles(rawMsg));
		}
		chat.members.filter((item) => {
			if (item.id !== user.user.id) {
				setOtherUserData(item);
			} else {
				setUserData(item);
			}
		});

		if (!!chat.drafts.length) {
			setDraft(chat.drafts[0].text);
		}

		setNotReadMessages(dedupeMessages(chat.notReadMessages));
	}, []);

	useEffect(() => {
		if (user.socket === null) return;

		user.socket.on("getDraft", ({ text, chatId }) => {
			if (chatId !== chat.id) return;
			setDraft(text);
		});

		user.socket.on("incReadMessege", (message) => {
			if (message.chatId !== chat.id) return;

			// Воспроизводим звук если сообщение от другого пользователя и вкладка неактивна
			if (message.userId !== user.user.id && document.hidden) {
				const audio = new Audio(notificationAudio);
				audio.volume = 0.5;
				audio.play().catch((err) => {
					console.log("Не удалось воспроизвести звук:", err);
				});
			}

			setNotReadMessages((prevMessages) => {
				if (message.userId === user.user.id) return prevMessages;
				return dedupeMessages([...prevMessages, message]);
			});
		});

		user.socket.on("lastMessage", (message) => {
			if (message.chatId !== chat.id) return;

			console.log(message);
			setLastMessage(processMessageFiles(message));
		});
		user.socket.on("getNotReadMessage", (message) => {
			setNotReadMessages((prevMessages) => {
				return prevMessages.filter(
					(messageRead) => messageRead.id !== message.id
				);
			});
		});

		user.socket.on("getWriting", ({ chatId, isWriting }) => {
			if (chatId !== chat.id) return;
			setIsWriting(isWriting);
		});

		console.log(user.socket);
	}, [user.socket, chat]);

	return (
		<>
			{chat.is_group ? (
				<Link
					className={
						chat.id === hashGroup
							? style.chat + " " + style.chat_active
							: style.chat
					}
					to={MESSENGER_ROUTE + `/#chatGroup=${chat.id}`}
				>
					<div className={style.chat__avatar}>
						<img
							src={
								process.env.REACT_APP_API_URL +
								"/" +
								`${
									chat.members.length < 2
										? userData.avatar
										: otherUserData.avatar
								}`
							}
							alt=""
						/>
					</div>
					<div className={style.chat__text}>
						<span className={style.chat__textName}>{chat.name}</span>
						<p className={style.chat__textMessage}>Сообщение...</p>
					</div>
					<div className={style.chat__info}>
						<span className={style.chat__infoTime}>15:43</span>
						<div className={style.chat__infoCount}>
							<span className={style.chat__infoCountText}>1</span>
						</div>
					</div>
				</Link>
			) : (
				<Link
					className={
						chat.members.length < 2
							? userData.id === hash
								? style.chat + " " + style.chat_active
								: style.chat
							: otherUserData.id === hash
							? style.chat + " " + style.chat_active
							: style.chat
					}
					to={
						MESSENGER_ROUTE +
						`/#${chat.members.length < 2 ? userData.id : otherUserData.id}`
					}
				>
					<div className={style.chat__avatar}>
						<img
							src={
								process.env.REACT_APP_API_URL +
								"/" +
								`${
									chat.members.length < 2
										? userData.avatar
										: otherUserData.avatar
								}`
							}
							alt=""
						/>
					</div>
					<div className={style.chat__text}>
						<span className={style.chat__textName}>
							{chat.members.length < 2 ? "Избранное" : otherUserData.name}
						</span>
						{isWriting ? (
							<p
								className={
									style.chat__textMessage +
									" " +
									style.chat__textMessage_writing
								}
							>
								Печатает
							</p>
						) : (
							<div className={style.chat__textMessage}>
								{draft.length > 0 ? (
									<p>
										<span
											className={
												chat.members.length < 2
													? userData.id === hash
														? style.chat__textMessageDraft
														: style.chat__textMessageDraft +
														  " " +
														  style.chat__textMessageDraft_red
													: otherUserData.id === hash
													? style.chat__textMessageDraft
													: style.chat__textMessageDraft +
													  " " +
													  style.chat__textMessageDraft_red
											}
										>
											Черновик:{" "}
										</span>
										{draft}
									</p>
								) : lastMessage.files && lastMessage.files.length > 0 ? (
									<div className={style.chat__textMessagePhotos}>
										<div className={style.chat__textMessagePhotosPreview}>
											{lastMessage.files.slice(0, 3).map((file, idx) => (
												<img
													key={idx}
													src={
														file.startsWith("http")
															? file
															: process.env.REACT_APP_API_URL + "/" + file
													}
													alt=""
												/>
											))}
										</div>
										<span className={style.chat__textMessagePhotosCount}>
											{lastMessage.files.length} фото
										</span>
									</div>
								) : (
									<p>{lastMessage.text}</p>
								)}
							</div>
						)}
					</div>
					<div className={style.chat__info}>
						{lastMessage.text && (
							<span className={style.chat__infoTime}>
								{useTimeFormatter(lastMessage.createdAt)}
							</span>
						)}

						{
							<CSSTransition
								in={notReadMessages.length >= 1}
								timeout={300}
								classNames="create-anim-scale"
								unmountOnExit
							>
								<div className={style.chat__infoCount}>
									<span className={style.chat__infoCountText}>
										{notReadMessages.length == 0 ? 1 : notReadMessages.length}
									</span>
								</div>
							</CSSTransition>
						}
					</div>
				</Link>
			)}
		</>
	);
});

export default Chat;
