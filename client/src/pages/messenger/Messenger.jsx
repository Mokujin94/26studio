import React, { useContext, useEffect, useState } from 'react'
import MessengerSideBar from '../../components/messengerSideBar/MessengerSideBar'
import MessengerContent from '../../components/messengerContent/MessengerContent'
import { useLocation } from 'react-router-dom'
import { fetchChat } from '../../http/chatsAPI';
import { observer } from 'mobx-react-lite';
import { Context } from '../..';

const Messenger = observer(() => {
	const { user } = useContext(Context);

	const [chatData, setChatData] = useState({});
	const [otherUserData, setOtherUserData] = useState({})
	const [messages, setMessages] = useState([])
	const [lastMessage, setLastMessage] = useState({})

	useEffect(() => {
		if (user.socket === null) return;
		user.socket.on("getMessages", (message) => {
			setLastMessage(message)
			console.log(message)
			if (message.chatId !== chatData.id) return;
			setMessages((prevMessages) => {
				const lastGroup = prevMessages[0];
				if (lastGroup && lastGroup[0].userId === message.userId) {
					// Добавляем в начало последней группы, если это от того же пользователя
					console.log("подпишу", [...prevMessages.slice(1, prevMessages.length)])
					return [[...lastGroup, message], ...prevMessages.slice(1, prevMessages.length)];
				} else {
					// Создаем новую группу, если это другой пользователь
					return [[message], ...prevMessages];
				}
			});
			console.log(message)
		});


		user.socket.on("getReadMessage", (updatedMessage) => {
			console.log(updatedMessage)


			setMessages(prevMessages => {
				const updatedMessages = prevMessages.map(group => {
					return group.map(message => {
						console.log(updatedMessage.id)
						if (message.id === updatedMessage.id) {
							// Если это обновляемое сообщение, возвращаем новый объект с обновленными данными
							// return updatedMessage
							console.log('log', updatedMessage)
							return { ...message, ...updatedMessage };
						} else {
							// Если это не обновляемое сообщение, просто возвращаем его без изменений
							return message;
						}
					});
				});
				console.log(updatedMessages)
				return updatedMessages
			});


		})

		return () => {
			user.socket.off("getMessages")
			user.socket.off("getReadMessage")
		}
	}, [user.socket, chatData])

	console.log(messages)

	return (
		<div className='messenger'>
			<div className="messenger__inner">
				<MessengerSideBar
					messages={messages}
					lastMessage={lastMessage}
				/>
				<MessengerContent
					setChatData={setChatData}
					chatData={chatData}
					otherUserData={otherUserData}
					setOtherUserData={setOtherUserData}
					messages={messages}
					setMessages={setMessages}
				/>
			</div>
		</div>
	)
})

export default Messenger