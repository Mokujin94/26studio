import React, { useContext, useState } from 'react'
import style from './message.module.scss'
import MessageContent from '../messageContent/MessageContent'
import { observer } from 'mobx-react-lite'
import { Context } from '../..'
const Message = observer(({ messages }) => {
	const { user } = useContext(Context)
	console.log(messages)
	return (
		// <div className={style.message}>
		<div className={style.message}>
			<div className={style.message__avatar}>
				<img src={process.env.REACT_APP_API_URL + "/" + 'avatar.jpg'} alt="" />
			</div>
			<div className={style.message__list}>
				{
					messages.map(message => {
						if (message.userId == user.user.id) {

							return <MessageContent content={message.text} isOther={false} />
						} else {
							return <MessageContent content={message.text} isOther={true} />
						}
						console.log(message)
					})
				}
			</div>
		</div >
	)
})

export default Message