import React, { useContext, useState } from 'react'
import style from './message.module.scss'
import MessageContent from '../messageContent/MessageContent'
import { observer } from 'mobx-react-lite'
import { Context } from '../..'
const Message = observer(({ content }) => {
	const { user } = useContext(Context)
	const [isRead, setIsRead] = useState(false)
	return (
		// <div className={style.message}>
		<div className={style.message}>
			<div className={style.message__avatar}>
				<img src={process.env.REACT_APP_API_URL + "/" + 'avatar.jpg'} alt="" />
			</div>
			<div className={style.message__list}>
				{
					content.sort((a, b) => a.id - b.id).map(item => {
						if (item.userId === user.user.id) {
							return <MessageContent content={item.content} isOther={false} />
						} else {
							return <MessageContent content={item.content} isOther={true} />
						}
					})
				}
				{/* <MessageContent />
				<MessageContent isOther={isOther} />
				<MessageContent isOther={isOther} />
				<MessageContent isOther={isOther} /> */}
			</div>
		</div >
	)
})

export default Message