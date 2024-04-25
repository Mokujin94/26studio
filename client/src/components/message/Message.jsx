import React, { useState } from 'react'
import style from './message.module.scss'
import MessageContent from '../messageContent/MessageContent'
function Message({ isOther, count }) {
	const [isRead, setIsRead] = useState(false)
	const makeMessage = () => {
		let messages = [];
		for (let i = 0; i < count; i++) {
			messages.push(<MessageContent isOther={isOther} />)
		}
		return messages
	}

	return (
		// <div className={style.message}>
		<div className={isOther ? style.message + " " + style.message_other : style.message}>
			<div className={style.message__avatar}>
				<img src={process.env.REACT_APP_API_URL + "/" + 'avatar.jpg'} alt="" />
			</div>
			<div className={style.message__list}>
				{
					makeMessage()
				}
				{/* <MessageContent />
				<MessageContent isOther={isOther} />
				<MessageContent isOther={isOther} />
				<MessageContent isOther={isOther} /> */}
			</div>
		</div >
	)
}

export default Message