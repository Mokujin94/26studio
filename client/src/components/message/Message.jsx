import React, { useContext, useState } from 'react'
import style from './message.module.scss'
import MessageContent from '../messageContent/MessageContent'
import { observer } from 'mobx-react-lite'
import { Context } from '../..'
const Message = observer(() => {
	const { user } = useContext(Context)
	return (
		// <div className={style.message}>
		<div className={style.message}>
			<div className={style.message__avatar}>
				<img src={process.env.REACT_APP_API_URL + "/" + 'avatar.jpg'} alt="" />
			</div>
			<div className={style.message__list}>

				<MessageContent content={'dsfsdf'} isOther={false} />
				<MessageContent content={'dsfsdf'} isOther={false} />
			</div>
		</div >
	)
})

export default Message