import React, { useContext, useEffect, useState } from 'react'
import style from './messengerContent.module.scss'
import MessengerInteraction from '../messengerInteraction/MessengerInteraction'
import Message from '../message/Message'
import { useLocation, useParams } from 'react-router-dom'
import { useDateFormatter } from '../../hooks/useDateFormatter'
import { Context } from '../..'
import { observer } from 'mobx-react-lite'
import { fetchPersonalChat, onReadMessage } from '../../http/messengerAPI'
import socketIOClient from "socket.io-client";
const MessengerContent = observer(({ setChatData, chatData, otherUserData, setOtherUserData, messages, setMessages }) => {

	const { user } = useContext(Context)

	const location = useLocation();
	const hash = location.hash.replace("#", "")

	useEffect(() => {
		if (!hash) return;
		fetchPersonalChat(Number(hash), user.user.id).then(data => {
			setChatData(data);
			setOtherUserData(data.member)
			setMessages(data.messages);
			console.log(data.messages);
		})
	}, [hash])

	const handleVisible = async (messageId) => {
		// const findMessages = messages.filter(item => {
		//     if (item[0].userId === user.user.id) {
		//         return item;
		//     }
		// }).map(message => {
		//     return message.map(item => {
		//         if (item.id === messageId) {
		//             console.log(item)
		//             return item
		//         }
		//     })
		// })

		await onReadMessage(Number(user.user.id), Number(messageId)).then(data => {
			console.log(data)
		})
		// console.log(findMessages)
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
				{
					messages.map(messages => {
						return <Message messages={messages} handleVisible={handleVisible} />
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