import React, { useContext, useState } from 'react'
import style from './message.module.scss'
import MessageContent from '../messageContent/MessageContent'
import { observer } from 'mobx-react-lite'
import { Context } from '../..'
import { CSSTransition, TransitionGroup } from 'react-transition-group'
const Message = observer(({ messages }) => {
	const { user } = useContext(Context)
	console.log(messages[0])
	return (
		// <div className={style.message}>
		<div className={style.message}>
			<div className={style.message__avatar}>
				<img src={!!messages.length && process.env.REACT_APP_API_URL + "/" + messages[0].user.avatar} alt="" />
			</div>
			<div className={style.message__list}>
				{
					messages.map(message => {
						if (message.userId == user.user.id) {
							return (
								<MessageContent content={message} isOther={false} />
							)
						} else {
							return (
								<MessageContent content={message} isOther={true} />
							)
						}
					})
				}
			</div>
		</div >
	)
})

export default Message