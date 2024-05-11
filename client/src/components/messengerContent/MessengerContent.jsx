import React, { useContext, useEffect } from 'react'
import style from './messengerContent.module.scss'
import MessengerInteraction from '../messengerInteraction/MessengerInteraction'
import Message from '../message/Message'
import { useLocation } from 'react-router-dom'
import { Context } from '../..'
import { observer } from 'mobx-react-lite'
import { fetchPersonalChat, onReadMessage } from '../../http/messengerAPI'
import { useDayMonthFormatter } from '../../hooks/useDayMonthFormatter'
const MessengerContent = observer(({ chats, setChatData, chatData, otherUserData, setOtherUserData, messages, setMessages, hash }) => {

	const { user } = useContext(Context)

	useEffect(() => {
		chats.map(chat => {
			chat.members.filter(item => {
				if (item.id !== user.user.id && item.id === hash) {
					setOtherUserData(item)
				}
			})
		})

		if (!hash) return;
		fetchPersonalChat(Number(hash), user.user.id).then(data => {
			setChatData(data);
			// setOtherUserData(data.member)
			setMessages(data.messages);
		})
	}, [hash])

	useEffect(() => {

		chats.map(chat => {
			chat.members.filter(item => {
				if (item.id !== user.user.id && item.id === hash) {
					setOtherUserData(item)
				}
			})
		})
	}, [chats])



	const handleVisible = async (messageId) => {
		messages.map((group) => {
			return group.map((message) => {
				if (message.id === messageId && message.userId !== user.user.id) {
					console.log(message)
					message.isRead = true;
					user.socket.emit("onReadMessage", { message: message, recipientId: hash }); // Объединяем старое и новое сообщение
					user.socket.emit("onNotReadMessage", { message: message, recipientId: user.user.id }); // Объединяем старое и новое сообщение
				}
				return message;
			});
		});



		await onReadMessage(Number(user.user.id), Number(messageId)).then(data => {
			console.log(data)
		})
		// console.log(findMessages)
	};

	// const renderMessagesWithDate = () => {
	// 	let jsx = [];
	// 	let lastDate = null;

	// 	messages.forEach((messageGroup, index) => {
	// 		const groupDate = messageGroup[messageGroup.length - 1].createdAt;
	// 		const lastGroup = messages[index - 1];
	// 		console.log(index)
	// 		const lastGroupDate = lastGroup ? lastGroup[lastGroup.length - 1].createdAt : null;



	// 		if (lastGroupDate && isDifferentDay(new Date(groupDate), new Date(lastGroupDate))) {
	// 			// Если последнее сообщение предыдущей группы было отправлено в другой день,
	// 			// добавляем компонент с датой
	// 			console.log(groupDate)
	// 			jsx.push(
	// 				<div key={`date-${groupDate}`} className={style.content__inner_date}>
	// 					{useDayMonthFormatter(lastDate)}
	// 				</div>
	// 			);
	// 		}

	// 		// Добавляем все сообщения из текущей группы
	// 		jsx.push(
	// 			<Message key={`message-group-${index}`} messages={messageGroup} handleVisible={handleVisible} />
	// 		);
	// 		if (index === messages.length - 1 && isDifferentDay(new Date(groupDate), new Date(lastGroupDate))) {
	// 			jsx.push(
	// 				<div key={`date-${lastGroupDate}`} className={style.content__inner_date}>
	// 					{useDayMonthFormatter(groupDate)}
	// 				</div>
	// 			);
	// 		}
	// 		// Обновляем дату последнего сообщения для следующей итерации
	// 		lastDate = groupDate;
	// 	});

	// 	return jsx;
	// };

	// Функция для проверки, различаются ли две даты по дню
	const isDifferentDay = (date1, date2) => {
		return (
			date1.getFullYear() !== date2.getFullYear() ||
			date1.getMonth() !== date2.getMonth() ||
			// date1.getDay() !== date2.getDay() ||
			date1.getDate() !== date2.getDate()
		);
	};
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
				{/* {renderMessagesWithDate()} */}
				{
					messages.map((messageGroup, index) => {
						const groupDate = messageGroup[0].createdAt;
						const lastGroup = messages[index + 1];
						const lastGroupDate = lastGroup ? lastGroup[0].createdAt : null;

						if (lastGroupDate && isDifferentDay(new Date(groupDate), new Date(lastGroupDate))) {
							return (
								<>

									<Message key={`message-group-${messageGroup[0].id}`} messages={messageGroup} handleVisible={handleVisible} />
									<div key={`date-${lastGroupDate}`} className={style.content__inner_date}>
										{useDayMonthFormatter(groupDate)}
									</div>
								</>
							)
						} else if (!lastGroupDate) {
							return (
								<>

									<Message key={`message-group-${messageGroup[0].id}`} messages={messageGroup} handleVisible={handleVisible} />
									<div key={`date-${lastGroupDate}`} className={style.content__inner_date}>
										{useDayMonthFormatter(groupDate)}
									</div>
								</>
							)

						} else return <Message key={`message-group-${messageGroup[0].id}`} messages={messageGroup} handleVisible={handleVisible} />

					})
				}

			</div>
			<div className={style.content__bottom}>
				<MessengerInteraction setMessages={setMessages} />
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