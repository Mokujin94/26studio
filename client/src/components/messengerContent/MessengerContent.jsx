import React, { useContext, useEffect, useState } from 'react'
import style from './messengerContent.module.scss'
import MessengerInteraction from '../messengerInteraction/MessengerInteraction'
import Message from '../message/Message'
import { useParams } from 'react-router-dom'
import { fetchChat, fetchMessages } from '../../http/chatsAPI'
import { useDateFormatter } from '../../hooks/useDateFormatter'
import { Context } from '../..'
import { observer } from 'mobx-react-lite'
const MessengerContent = observer(() => {
	const { user } = useContext(Context)
	const [chatData, setChatData] = useState({})
	const [isOnline, setIsOnline] = useState(Boolean)
	const [lastTimeOnline, setLastTimeOnline] = useState(Boolean)
	const [messages, setMessages] = useState([])
	const { id } = useParams();

	useEffect(() => {

		if (id) {
			fetchChat(id).then(data => {
				const lastOnline = new Date(data.users[0].lastOnline).getTime() / 1000;
				const nowTime = new Date().getTime() / 1000;
				if ((nowTime - lastOnline) <= 300) {
					setIsOnline(true)
				} else {
					const time = useDateFormatter(data.users[0].lastOnline)
					setLastTimeOnline(time);
					setIsOnline(false)
				}
				setChatData(data);
				console.log(data);
				fetchMessages(user.user.id, id).then((data) => {
					console.log(data);
					setMessages(data)
				})
			})

		}
	}, [id])

	const chatContent =
		<>
			<div className={style.content__header}>
				<div className={style.content__headerInfo}>
					{
						user.user.id == id
							?
							<span className={style.content__headerInfoName}>Избранное</span>
							:
							<>
								<span className={style.content__headerInfoName}>{chatData.users && chatData.users[0].name}</span>
								<span className={style.content__headerInfoOnline}>{isOnline ? 'Онлайн' : lastTimeOnline}</span>
							</>
					}

				</div>
			</div>
			<div className={style.content__inner}>
				{
					messages.map((item, i) => {
						return <Message content={item} key={item.id} />
					})
				}
			</div>
			<div className={style.content__bottom}>
				<MessengerInteraction />
			</div>
		</>
	const contentOutsideChat =
		<div className={style.content__inner}>
			<span className={style.content__innerText}>Выберите, кому хотели бы написать</span>
		</div>

	return (
		<div className={style.content}>
			{
				id
					?
					chatContent
					:
					contentOutsideChat
			}
		</div>
	)
})

export default MessengerContent