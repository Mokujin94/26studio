import React, { useContext, useEffect, useRef } from 'react'
import style from './messengerContent.module.scss'
import MessengerInteraction from '../messengerInteraction/MessengerInteraction'
import Message from '../message/Message'
import { useLocation } from 'react-router-dom'
import { Context } from '../..'
import { observer } from 'mobx-react-lite'
import { fetchPersonalChat, onReadMessage } from '../../http/messengerAPI'
import { useDayMonthFormatter } from '../../hooks/useDayMonthFormatter'
import { CSSTransition, SwitchTransition, TransitionGroup } from 'react-transition-group'
import Spinner from '../spinner/Spinner'
const MessengerContent = observer(({ chats, setChatData, chatData, otherUserData, setOtherUserData, messages, setMessages, hash, windowChat, totalCountMessages, setTotalCountMessages, setMessagesOffset, setIsFetchingMessages, setIsLoadingMessages, isLoadingMessages, isScrollBottom }) => {

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
			setTotalCountMessages(data.countMessages)

			setMessagesOffset(2)
			setIsLoadingMessages(false)
		})
	}, [Number(hash)])

	useEffect(() => {
		setTotalCountMessages(chatData.countMessages)
		setMessagesOffset(2)
		if (windowChat.current)
			windowChat.current.scrollTo({
				top: windowChat.current.scrollHeight,
			});
	}, [chatData, windowChat.current])

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
			return group.map((message) => {
				if (message.id === messageId && message.userId !== user.user.id) {

					message.isRead = true;
					user.socket.emit("onReadMessage", { message: message, recipientId: hash }); // Объединяем старое и новое сообщение
					user.socket.emit("onNotReadMessage", { message: message, recipientId: user.user.id }); // Объединяем старое и новое сообщение
				}
				return message;
			});
		});

		await onReadMessage(Number(user.user.id), Number(messageId)).catch(() => {
			console.log('fgsd')
		})
	};

	// Функция для проверки, различаются ли две даты по дню
	const isDifferentDay = (date1, date2) => {
		return (
			date1.getFullYear() !== date2.getFullYear() ||
			date1.getMonth() !== date2.getMonth() ||
			date1.getDate() !== date2.getDate()
		);
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
					<span className={style.content__headerInfoOnline}>Онлайн</span>

				</div>
			</div>


			<div className={style.content__inner} ref={windowChat}>
				{/* {renderMessagesWithDate()} */}
				{isLoadingMessages &&
					<div style={{ margin: "0 auto" }}>

						<Spinner />
					</div>
				}
				<TransitionGroup component={null}>
					{
						messages.map((messageGroup, index) => {
							const groupDate = messageGroup[messageGroup.length - 1].createdAt;
							const lastGroup = messages[index - 1];
							const lastGroupDate = lastGroup ? lastGroup[lastGroup.length - 1].createdAt : null;

							const key = `message-group-${messageGroup[0].id}`;

							if (lastGroupDate && isDifferentDay(new Date(groupDate), new Date(lastGroupDate))) {
								return (
									<CSSTransition
										key={key}
										in={!!hash}
										timeout={0}
									>
										<>
											<div key={`date-${lastGroupDate}`} className={style.content__inner_date}>
												{useDayMonthFormatter(groupDate)}
											</div>
											<Message isScrollBottom={isScrollBottom} windowChatRef={windowChat} messages={messageGroup} handleVisible={handleVisible} />
										</>
									</CSSTransition>
								)
							} else if (!lastGroupDate) {
								return (
									<CSSTransition
										key={key}
										in={!!hash}
										timeout={0}
									>
										<>
											<div key={`date-${lastGroupDate}`} className={style.content__inner_date}>
												{useDayMonthFormatter(groupDate)}
											</div>
											<Message isScrollBottom={isScrollBottom} windowChatRef={windowChat} messages={messageGroup} handleVisible={handleVisible} />
										</>
									</CSSTransition>
								)

							} else return (
								<CSSTransition
									key={key}
									in={!!hash}
									timeout={0}
								>
									<Message isScrollBottom={isScrollBottom} windowChatRef={windowChat} messages={messageGroup} handleVisible={handleVisible} />
								</CSSTransition>
							)

						})
					}
				</TransitionGroup>


			</div >




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