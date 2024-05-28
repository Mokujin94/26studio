import React, { useContext, useEffect, useRef, useState } from 'react'
import MessengerSideBar from '../../components/messengerSideBar/MessengerSideBar'
import MessengerContent from '../../components/messengerContent/MessengerContent'
import { observer } from 'mobx-react-lite';
import { Context } from '../..';
import { fetchAllChats, fetchMessages } from '../../http/messengerAPI';
import { useLocation } from 'react-router-dom';
import { useDebounce } from '../../hooks/useDebounce';

const Messenger = observer(() => {
	const { user } = useContext(Context);

	const location = useLocation();
	const hash = Number(location.hash.replace("#", ""))

	const [chats, setChats] = useState([]);
	const [chatData, setChatData] = useState({});
	const [otherUserData, setOtherUserData] = useState({})
	const [messages, setMessages] = useState([])
	const [lastMessage, setLastMessage] = useState({})
	const [isScrollBottom, setIsScrollBottom] = useState(true)
	const [messagesOffset, setMessagesOffset] = useState(2)
	const [isFetchingMessages, setIsFetchingMessages] = useState(false)
	const [totalCountMessages, setTotalCountMessages] = useState(0);
	const [isLoadingMessages, setIsLoadingMessages] = useState(true);
	const windowChatRef = useRef(null)

	const isDifferentDay = (date1, date2) => {
		return date1.getDate() === date2.getDate() &&
			date1.getMonth() === date2.getMonth() &&
			date1.getFullYear() === date2.getFullYear() &&
			date1.getHours() === date2.getHours();
	};

	useEffect(() => {
		fetchAllChats(user.user.id).then(data => {
			setChats(data.chats)
		})
		// return () => {
		// 	user.socket.off("incReadMessege")
		// 	user.socket.off("lastMessage")
		// 	user.socket.off("getNotReadMessage")
		// 	user.socket.off("getWriting")
		// }
	}, [])

	useEffect(() => {

		if (user.socket === null) return;
		user.socket.on("getMessages", (message) => {

			const promise = new Promise((resolve, reject) => {
				setLastMessage(message);

				if (message.chatId !== chatData.id) return;
				setMessages((prevMessages) => {
					const lastGroup = prevMessages[prevMessages.length - 1];

					if (lastGroup && !isDifferentDay(new Date(lastGroup[lastGroup.length - 1].createdAt), new Date(message.createdAt))) {
						// Создаем новую группу, если сообщение написанно в другом часу или в другой день
						resolve();
						return [...prevMessages, [message]];
					}

					if (lastGroup && lastGroup[0].userId === message.userId) {
						// Добавляем в конец последней группы, если это от того же пользователя
						resolve();
						return [...prevMessages.slice(0, prevMessages.length - 1), [...lastGroup, message]];
					} else {
						// Создаем новую группу, если это другой пользователь
						resolve();
						return [...prevMessages, [message]];
					}
				});
				resolve();
			});

		});




		user.socket.on("getReadMessage", (updatedMessage) => {


			setMessages(prevMessages => {
				const updatedMessages = prevMessages.map(group => {
					return group.map(message => {
						if (message.id === updatedMessage.id) {
							// Если это обновляемое сообщение, возвращаем новый объект с обновленными данными
							// return updatedMessage
							return { ...message, ...updatedMessage };
						} else {
							// Если это не обновляемое сообщение, просто возвращаем его без изменений
							return message;
						}
					});
				});

				return updatedMessages
			});


		})

		return () => {
			user.socket.off("getMessages")
			user.socket.off("getReadMessage")
		}
	}, [user.socket, chatData])

	useEffect(() => {
		if (!windowChatRef.current) return;

		const checkScrollHandler = () => {
			const windowChat = windowChatRef.current;
			if (!windowChat) return false; // Проверка на случай, если ref не существует
			const scrollOffset = windowChat.scrollHeight - windowChat.scrollTop;
			const bottomOffset = 300; // Здесь вы указываете, сколько пикселей до низа блока вы хотите обнаружить
			const totalElements = messages.reduce((acc, arr) => acc + arr.length, 0);
			if (windowChat.scrollTop <= 500 && totalElements < totalCountMessages && !isLoadingMessages) {
				console.log("true")
				setIsFetchingMessages(true);
			}

			if (scrollOffset <= windowChat.clientHeight + bottomOffset) {
				setIsScrollBottom(true)
			} else {
				setIsScrollBottom(false)
			}
		}

		const ref = windowChatRef.current;

		if (ref) {
			ref.addEventListener("scroll", checkScrollHandler);
		}

		return () => {
			if (ref) {
				ref.removeEventListener("scroll", checkScrollHandler);
			}
		};
	}, [chatData, messages, totalCountMessages, isFetchingMessages, hash, windowChatRef.current])




	useEffect(() => {


		if (isScrollBottom) {
			setTimeout(() => {
				if (windowChatRef.current)
					windowChatRef.current.scrollTo({
						top: windowChatRef.current.scrollHeight,
						behavior: "smooth",
					});
			}, 0)

		}

	}, [lastMessage])

	useEffect(() => {
		if (chatData.id && isFetchingMessages) {
			setIsLoadingMessages(true)
			const currentScrollHeight = windowChatRef.current.scrollHeight;
			const currentScrollTop = windowChatRef.current.scrollTop;
			fetchMessages(chatData.id, messagesOffset).then((data) => {
				console.log(data)
				setMessages(prevMessages => {
					return [...data.rows, ...prevMessages]
				})
				windowChatRef.current.scrollTop = windowChatRef.current.scrollHeight - currentScrollHeight + currentScrollTop;
				setMessagesOffset(prevOffset => prevOffset + 1)

			}).finally(() => {
				setIsFetchingMessages(false)
				setIsLoadingMessages(false)
			})
		}
	}, [isFetchingMessages, chatData, messagesOffset])



	return (
		<div className='messenger'>
			<div className="messenger__inner">
				<MessengerSideBar
					chats={chats}
					setChats={setChats}
					messages={messages}
					lastMessage={lastMessage}
					hash={hash}
				/>
				<MessengerContent
					chats={chats}
					setChatData={setChatData}
					chatData={chatData}
					otherUserData={otherUserData}
					setOtherUserData={setOtherUserData}
					messages={messages}
					setMessages={setMessages}
					hash={hash}
					windowChat={windowChatRef}
					totalCountMessages={totalCountMessages}
					setTotalCountMessages={setTotalCountMessages}
					setMessagesOffset={setMessagesOffset}
					setIsFetchingMessages={setIsFetchingMessages}
					setIsLoadingMessages={setIsLoadingMessages}
					isLoadingMessages={isLoadingMessages}
					isScrollBottom={isScrollBottom}
				/>
			</div>
		</div>
	)
})

export default Messenger