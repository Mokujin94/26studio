import React, { useContext, useEffect, useState } from 'react'
import style from './messengerContent.module.scss'
import MessengerInteraction from '../messengerInteraction/MessengerInteraction'
import Message from '../message/Message'
import { useLocation, useParams } from 'react-router-dom'
import { useDateFormatter } from '../../hooks/useDateFormatter'
import { Context } from '../..'
import { observer } from 'mobx-react-lite'
import { fetchPersonalChat } from '../../http/messengerAPI'
import socketIOClient from "socket.io-client";
const MessengerContent = observer(() => {
	const socket = socketIOClient(process.env.REACT_APP_API_URL);

	const { user } = useContext(Context)

	const [chatData, setChatData] = useState({});
	const [otherUserData, setOtherUserData] = useState({})
	const [messages, setMessages] = useState([])

	const location = useLocation();
	const hash = location.hash.replace("#", "")

	// Функция для добавления нового сообщения
	const addMessage = (message) => {

	};

	useEffect(() => {
		if (!hash) return;
		fetchPersonalChat(Number(hash), user.user.id).then(data => {
			setChatData(data);
			setOtherUserData(data.member)
			setMessages(data.messages);
			console.log(data);

			// Подключение к комнате чата
			socket.emit('joinChat', data.id);

			console.log(`Joined chat with ID ${data.id}`);

			// Подписка на новые сообщения

		})
		socket.on('newMessage', (message) => {
			setMessages((prevMessages) => {
				const lastGroup = prevMessages[0];
				console.log(lastGroup[0], message.userId)
				if (lastGroup && lastGroup[0].userId === message.userId) {
					// Добавляем в начало последней группы, если это от того же пользователя
					return [[...lastGroup, message], ...prevMessages.slice(1, prevMessages.length)];
				} else {
					// Создаем новую группу, если это другой пользователь
					return [[message], ...prevMessages];
				}
			});
			// console.log(message)
		});
		return () => {
			if (chatData.id) {
				// Если chatId установлен, отключаемся от чата при выходе
				socket.emit('leaveChat', chatData.id);
			}
			socket.off('newMessage'); // Убираем подписку
		};
	}, [hash])

	console.log(messages)
	const contentOutsideChat =
		<div className={style.content__inner}>
			<span className={style.content__innerText}>Выберите, кому хотели бы написать</span>
		</div>

	const contentChat =
		<>
			<div className={style.content__header}>
				<div className={style.content__headerInfo}>

					<span className={style.content__headerInfoName}>{Number(hash) === user.user.id ? "Избранное" : otherUserData.name}</span>
					<span className={style.content__headerInfoOnline}>Онлайн</span>

				</div>
			</div>

			<div className={style.content__inner}>
				{
					messages.map(messages => {
						return <Message messages={messages} />
					})
				}

			</div>
			<div className={style.content__bottom}>
				<MessengerInteraction />
			</div>
		</>
	return (
		<div className={style.content}>
			{
				hash
					?
					contentChat
					:
					contentOutsideChat
			}
		</div>
	)
})

export default MessengerContent