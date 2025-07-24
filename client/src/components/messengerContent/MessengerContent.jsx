import React, { useCallback, useContext, useEffect, useRef, useState } from 'react'
import style from './messengerContent.module.scss'
import MessengerInteraction from '../messengerInteraction/MessengerInteraction'
import Message from '../message/Message'
import { useLocation } from 'react-router-dom'
import { Context } from '../..'
import { observer } from 'mobx-react-lite'
import { fetchPersonalChat, onReadMessage, sendMessage } from '../../http/messengerAPI'
import { useDayMonthFormatter } from '../../hooks/useDayMonthFormatter'
import { CSSTransition, SwitchTransition, TransitionGroup } from 'react-transition-group'
import Spinner from '../spinner/Spinner'
import MessageContextMenu from '../messageContextMenu/MessageContextMenu'
import { useDateFormatter } from '../../hooks/useDateFormatter'
import Cross from '../cross/Cross'
import MessengerModalFiles from '../messengerModalFiles/MessengerModalFiles'
const MessengerContent = observer(({ chats, setChats, setChatData, chatData, otherUserData, setOtherUserData, messages, setMessages, hash, windowChat, totalCountMessages, setTotalCountMessages, setMessagesOffset, setIsFetchingMessages, setIsLoadingMessages, isLoadingMessages, isScrollBottom }) => {

	const { user } = useContext(Context)
	const [isWriting, setIsWriting] = useState(false)
	const [isModal, setIsModal] = useState(false)
	const [files, setFiles] = useState([])
	const [notReadMessages, setNotReadMessages] = useState([])
	const dedupeMessages = useCallback((arr) => {
		const seen = new Set()
		return arr.filter(msg => {
			if (seen.has(msg.id)) return false
			seen.add(msg.id)
			return true
		})
	}, [])
	const [hasScrolledUnread, setHasScrolledUnread] = useState(false)

	const [isOnline, setIsOnline] = useState(false)
	const [lastTimeOnline, setLastTimeOnline] = useState('')
	const [replyMessage, setReplyMessage] = useState({ id: null, userName: '', text: '' })
	const toMessagesRef = useRef(null)
	const bottomRef = useRef(null)
	const inputRef = useRef(null)

	const firstUnreadId = React.useMemo(() => {
		if (!notReadMessages.length) return null
		const sorted = [...notReadMessages].sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
		return sorted[0].id
	}, [notReadMessages])

	const [contextMenu, setContextMenu] = useState({
		visible: false,
		x: 0,
		y: 0,
		message: {
			id: null,
			userName: '',
			text: '',
		},
	});

	const handleContextMenu = (event, message) => {
		event.preventDefault();
		const containerRect = windowChat.current.getBoundingClientRect();
		const scrollTop = windowChat.current.scrollTop;
		const scrollLeft = windowChat.current.scrollLeft;
		setContextMenu({
			visible: true,
			x: event.clientX - containerRect.left + scrollLeft,
			y: event.clientY - containerRect.top + scrollTop,
			message: {
				id: message.id,
				userName: message.user.name,
				text: message.text,
			},
		});
	};

	const handleCloseContextMenu = () => {
		setContextMenu(prev => {
			return { ...prev, visible: false, message: { id: null, userName: '', text: '' } }
		});
	};

	const handleReply = (message) => {
		if (message.id !== replyMessage.id) {
			setReplyMessage(prev => {
				return { ...prev, ...message }
			})
		}

		// if (windowChat.current) {
		// 	if (windowChat.current.scrollTop === windowChat.current.scrollHeight - windowChat.current.clientHeight) {
		// 		setTimeout(() => {
		// 			windowChat.current.scrollTo({
		// 				top: windowChat.current.scrollHeight,
		// 				behavior: 'smooth'
		// 			})
		// 		}, 300);
		// 	}
		// 	// const chatScrollBottom = windowChat.current.scrollTop = windowChat.current.scrollHeight - windowChat.current.clientHeight;
		// 	// console.log(chatScrollBottom);
		// 	// console.log(windowChat.current.scrollHeight);
		// }
		// console.log(replyMessage)
		// console.log(`Ответить на сообщение: ${message.text}`);
		handleCloseContextMenu();
	};

	// Обработчик нажатия клавиш
	const handleKeyDown = (e) => {
		if (document.activeElement.tagName !== 'INPUT' && document.activeElement.tagName !== 'TEXTAREA' && document.activeElement !== inputRef.current) {
			const range = document.createRange();
			range.selectNodeContents(inputRef.current);
			range.collapse(false);
			const sel = window.getSelection();
			sel.removeAllRanges();
			sel.addRange(range);
		}
	};

	// Добавление обработчика нажатия клавиш при монтировании компонента
	useEffect(() => {
		window.addEventListener('keydown', handleKeyDown);
		return () => {
			window.removeEventListener('keydown', handleKeyDown);
		};
	}, []);

	const handleCopy = (messageId) => {
		messages.map(group => {
			group.map(msg => {
				if (msg.id === messageId) {
					navigator.clipboard.writeText(msg.text)
				}
			})
		})
		handleCloseContextMenu();
	};

	useEffect(() => {

		const lastOnline = new Date(chatData?.member?.lastOnline).getTime() / 1000;
		const nowTime = new Date().getTime() / 1000;
		if ((nowTime - lastOnline) <= 300) {
			setIsOnline(true)
		} else {
			const time = useDateFormatter(chatData?.member?.lastOnline)
			setLastTimeOnline(time);
			setIsOnline(false)
		}

		console.log(chatData)
		user.socket.on("getWritingOnlyChat", ({ chatId, isWriting }) => {
			if (chatData.id !== chatId) return;
			setIsWriting(isWriting);
		})

		user.socket.on("incReadMessege", (message) => {
			if (message.chatId !== chatData.id) return;
			setNotReadMessages(prevMessages => {
				if (message.userId === user.user.id) return prevMessages;
				return dedupeMessages([...prevMessages, message])
			})
		})
		user.socket.on("getNotReadMessage", (message) => {
			setNotReadMessages(prevMessages => {
				return prevMessages.filter(messageRead => messageRead.id !== message.id)
			})
		})

		setTotalCountMessages(chatData.countMessages)
		setMessagesOffset(2)

		return () => {
			user.socket.off("getWritingOnlyChat")
		}
	}, [user.socket, chatData])

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
			if (!data.is_chat) {
				setOtherUserData(data.member)
			}
			setChatData(data);
			// setOtherUserData(data.member)
			const mappedMessages = data.messages.map(group =>
				group.map(msg => ({
					...msg,
					files: msg.files ? msg.files.map(f => process.env.REACT_APP_API_URL + f) : msg.files,
				}))
			);
			setMessages(mappedMessages);
			setTotalCountMessages(data.countMessages);
			setNotReadMessages(dedupeMessages(data.notReadMessages || []));

			setMessagesOffset(2);
			setIsLoadingMessages(false);
			setHasScrolledUnread(false);

			if (!data.notReadMessages || !data.notReadMessages.length) {

				setTimeout(() => scrollToBottom(), 0);
			}
		}).catch(e => console.log(e))
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
		const totalElements = messages.reduce((acc, arr) => acc + arr.length, 0);

		if (messages[0][0].id === messageId && totalElements < totalCountMessages) {
			setIsFetchingMessages(true)
		}
		messages.map((group) => {
			return group.map(async (message) => {
				if (message.id === messageId && message.userId !== user.user.id) {
					await onReadMessage(Number(user.user.id), Number(messageId)).catch((e) => {
						console.log(e)
					})
					message.isRead = true;
					user.socket.emit("onReadMessage", { message: message, recipientId: hash }); // Объединяем старое и новое сообщение
					user.socket.emit("onNotReadMessage", { message: message, recipientId: user.user.id }); // Объединяем старое и новое сообщение
				}
				return message;
			});
		});


	};

	// useEffect(() => {
	// 	console.log(bottomRef.current.clientHeight);
	// 	setTimeout(() => {
	// 		scrollToBottomSmooth()

	// 	}, 0);
	// }, [bottomRef.current.clientHeight])

	const scrollToBottom = () => {
		toMessagesRef.current?.scrollIntoView()
	}

	const scrollToBottomSmooth = () => {
		toMessagesRef.current?.scrollIntoView({
			behavior: 'smooth'
		})
	}

	const handleScrollToBottom = useCallback(() => {
		if (windowChat.current) {
			const scrollBottom = windowChat.current.scrollHeight - windowChat.current.scrollTop - windowChat.current.clientHeight
			if (scrollBottom > windowChat.current.clientHeight) {
				windowChat.current.scrollTop = windowChat.current.scrollHeight - windowChat.current.clientHeight - 299;
				setTimeout(() => {
					scrollToBottomSmooth()
				}, 0)
			} else {
				scrollToBottomSmooth()
			}
		}
	}, [windowChat.current])

	const scrollToFirstUnread = useCallback((unread = notReadMessages) => {
		if (!windowChat.current || !unread.length) return;
		const sorted = [...unread].sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
		const firstUnread = sorted[0];
		const element = document.getElementById(`message-${firstUnread.id}`);
		if (element) {
			windowChat.current.scrollTop = element.offsetTop;
		} else {
			scrollToBottom();
		}
	}, [notReadMessages, windowChat.current])


	useEffect(() => {
		if (!chatData.id || !notReadMessages.length || hasScrolledUnread) return;

		const sorted = [...notReadMessages].sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
		const firstUnread = sorted[0];

		const isLoaded = messages.some(group => group.some(msg => msg.id === firstUnread.id));
		const totalLoaded = messages.reduce((acc, arr) => acc + arr.length, 0);

		if (isLoaded) {
			scrollToFirstUnread(notReadMessages);
			setHasScrolledUnread(true);
		} else if (totalLoaded < totalCountMessages && !isLoadingMessages) {
			setIsFetchingMessages(true);
		}
	}, [messages, notReadMessages, chatData.id, totalCountMessages, isLoadingMessages, hasScrolledUnread])

	console.log(notReadMessages);
	// Функция для проверки, различаются ли две даты по дню
	const isDifferentDay = (date1, date2) => {
		return (
			date1.getFullYear() !== date2.getFullYear() ||
			date1.getMonth() !== date2.getMonth() ||
			date1.getDate() !== date2.getDate()
		);
	};

	const handleSendFiles = (text) => {
		if (!text && !files.length) return;
		if (replyMessage.id !== null) {
			setReplyMessage(prev => ({ ...prev, id: null }));
		}
		const fileUrls = files.map(f => URL.createObjectURL(f));
		let message = {
			id: Date.now(),
			createdAt: Date.now(),
			text,
			files: fileUrls,
			load: true,
			user: {
				avatar: user.user.avatar,
				id: user.user.id,
			},
			userId: user.user.id,
		};
		setFiles([]);
		setIsModal(false);
		setMessages(prevMessages => {
			const lastGroup = prevMessages[prevMessages.length - 1];

			if (lastGroup && !isDifferentDay(new Date(lastGroup[lastGroup.length - 1].createdAt), new Date(message.createdAt))) {
				return [...prevMessages, [message]];
			}

			if (lastGroup && lastGroup[0].userId === message.userId) {
				return [...prevMessages.slice(0, prevMessages.length - 1), [...lastGroup, message]];
			} else {
				return [...prevMessages, [message]];
			}
		});

		if (isScrollBottom) {
			setTimeout(() => {
				if (windowChat.current)
					windowChat.current.scrollTo({
						top: windowChat.current.scrollHeight,
						behavior: "smooth",
					});
			}, 0);
		}


		sendMessage(Number(hash), user.user.id, text, files)

			.then(async data => {
				if (!chatData.id && data.userId == user.user.id) {
					await fetchPersonalChat(hash, user.user.id).then(data => {
						setChats(prevChats => [...prevChats, data]);
						setChatData(prevChatData => ({ ...prevChatData, ...data }));
					});
				}
				return data;
			})
			.then(data => {
				if (user.user.id === hash) {
					user.socket.emit("sendMessage", { message: data, recipientId: hash });
				} else {
					user.socket.emit("sendMessageRecipient", { message: data, recipientId: hash });
					user.socket.emit("sendMessage", { message: data, recipientId: hash });
				}
				return data;
			})
			.then(data => {
				setMessages(prevMessages => {
					return prevMessages.map(group => {
						return group.map(oldMessage => {
							if (oldMessage.id === message.id) {
								const serverFiles = (data.files || []).map(f => process.env.REACT_APP_API_URL + f);
								return { ...oldMessage, load: false, ...data, files: serverFiles };

							}
							return oldMessage;
						});
					});
				});
			});
	};
	const contentOutsideChat =
		<div className={style.content__inner}>
			<span className={style.content__innerText}>Выберите, кому хотели бы написать</span>
		</div>

	const contentChat =
		<>
			<div className={style.content__header}>
				<div className={style.content__headerInfo}>

					<span className={style.content__headerInfoName}>{Number(hash) === user.user.id ? "Избранное" : otherUserData.name}</span>
					{
						isWriting ? (
							<span className={style.content__headerInfoOnline + " " + style.content__headerInfoOnline_writing + " " + style.content__headerInfoOnline_primary}>
								Печатает
							</span>
						) : (
							<span className={isOnline ? style.content__headerInfoOnline + " " + style.content__headerInfoOnline_primary : style.content__headerInfoOnline}>
								{
									isOnline ? 'Онлайн' : lastTimeOnline
								}
							</span>
						)

					}

				</div>
			</div>


			<div className={style.content__inner} onClick={handleCloseContextMenu} ref={windowChat}>
				{/* {renderMessagesWithDate()} */}
				{isLoadingMessages &&
					<div style={{ margin: "0 auto" }}>
						<Spinner />
					</div>
				}
				<TransitionGroup component={null}>
					{messages.map((messageGroup, index) => {
						const groupDate = messageGroup[messageGroup.length - 1].createdAt;
						const lastGroup = messages[index - 1];
						const lastGroupDate = lastGroup ? lastGroup[lastGroup.length - 1].createdAt : null;

						const key = `message-group-${messageGroup[0].id}`;

						const elements = [];

						if (!lastGroupDate || isDifferentDay(new Date(groupDate), new Date(lastGroupDate))) {
							elements.push(
								<div key={`date-${groupDate}`} className={style.content__inner_date}>
									{useDayMonthFormatter(groupDate)}
								</div>
							);
						}

						if (firstUnreadId && messageGroup.some(m => m.id === firstUnreadId)) {
							elements.push(
								<div key={`unread-${firstUnreadId}`} className={style.content__inner_unread}>
									непрочитанные
								</div>
							);
						}

						elements.push(
							<Message
								key={`msg-${messageGroup[0].id}`}
								contextMenu={contextMenu}
								onContextMenu={handleContextMenu}
								isScrollBottom={isScrollBottom}
								windowChatRef={windowChat}
								messages={messageGroup}
								handleVisible={handleVisible}
							/>
						);

						return (
							<CSSTransition key={key} in={!!hash} timeout={0}>
								<>{elements}</>
							</CSSTransition>
						);
					})}
				</TransitionGroup>

				<CSSTransition
					in={isModal}
					timeout={300}
					classNames="create-anim"
					unmountOnExit
					mountOnEnter
				>

					<div
						className={style.content__modal}
						onClick={(e) => {
							if (e.target === e.currentTarget) {
								setIsModal(false);
							}
						}}
					>

						<MessengerModalFiles
							setIsModal={setIsModal}
							files={files}
							setFiles={setFiles}
							onSend={handleSendFiles}
						/>
					</div>
				</CSSTransition>

				<CSSTransition
					in={contextMenu.visible}
					timeout={300}
					classNames="create-anim"
					unmountOnExit
					mountOnEnter
				>
					<MessageContextMenu
						message={contextMenu.message}
						position={{ x: contextMenu.x, y: contextMenu.y }}
						onClose={handleCloseContextMenu}
						onReply={handleReply}
						onCopy={handleCopy}
					/>
				</CSSTransition>
				<div ref={toMessagesRef} />
			</div >




			<div className={style.content__bottom} ref={bottomRef}>
				<div className={replyMessage.id ? style.content__bottomReplyWrapper + " " + style.content__bottomReplyWrapper_active : style.content__bottomReplyWrapper}>
					<div className={style.content__bottomReply}>
						<div className={style.content__bottomReplyIcon}>
							<svg viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg" fill="#000000" class="bi bi-reply-fill">
								<g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
								<g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g>
								<g id="SVGRepo_iconCarrier">
									<path d="M5.921 11.9 1.353 8.62a.719.719 0 0 1 0-1.238L5.921 4.1A.716.716 0 0 1 7 4.719V6c1.5 0 6 0 7 8-2.5-4.5-7-4-7-4v1.281c0 .56-.606.898-1.079.62z"></path>
								</g>
							</svg>
						</div>
						<div className={style.content__bottomReplyInfo}>
							<p className={style.content__bottomReplyText}>Ответ <span className={style.content__bottomReplyUser}>{replyMessage.userName}</span></p>
							<span className={style.content__bottomReplyMessage}>{replyMessage.text}</span>
						</div>
						<div className={style.content__bottomReplyClose}>
							<Cross onClick={() => setReplyMessage(prev => {
								return { ...prev, id: null }
							})} />
						</div>
					</div>
				</div>
				<CSSTransition
					in={!isScrollBottom}
					timeout={300}
					classNames="create-anim"
					unmountOnExit
					mountOnEnter
				>
					<div className={style.content__innerScrollButton} onClick={handleScrollToBottom}>
						<CSSTransition
							in={!!notReadMessages.length > 0}
							timeout={300}
							classNames="create-anim"
							unmountOnExit
							mountOnEnter
						>
							<span style={{ minWidth: notReadMessages.length.length * 11 }} className={style.content__innerScrollButtonNotReadCount}>{notReadMessages.length}</span>
						</CSSTransition>
						<svg xmlns="http://www.w3.org/2000/svg" width="17" height="10" viewBox="0 0 17 10" fill="none">
							<path d="M1.5 1.5L7.26263 7.93043C7.94318 8.68986 9.05682 8.68986 9.73737 7.93043L15.5 1.5" stroke="#97BCE6" strokeWidth="1.5" stroke-miterlimit="10" strokeLinecap="round" strokeLinejoin="round">
							</path>
						</svg>
					</div>
				</CSSTransition>
				<MessengerInteraction
					chatData={chatData}
					setMessages={setMessages}
					isScrollBottom={isScrollBottom}
					windowChatRef={windowChat}
					setChatData={setChatData}
					setChats={setChats}
					replyMessage={replyMessage}
					setReplyMessage={setReplyMessage}
					inputRef={inputRef}
					setFiles={setFiles}
					files={files}
					setIsModal={setIsModal}
				/>
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
