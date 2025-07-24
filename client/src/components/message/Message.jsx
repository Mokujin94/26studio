import React, { useContext, useState } from 'react'
import style from './message.module.scss'
import MessageContent from '../messageContent/MessageContent'
import { observer } from 'mobx-react-lite'
import { Context } from '../..'
import { CSSTransition, TransitionGroup } from 'react-transition-group'
import { useLocation } from 'react-router-dom'
const Message = observer(({ contextMenu, onContextMenu, isScrollBottom, windowChatRef, messages, handleVisible }) => {
	const { user } = useContext(Context)
	const location = useLocation();
	const hash = Number(location.hash.replace("#", ""))

	return (
		// <div className={style.message}>
		<div className={style.message}>
			<div className={style.message__avatar}>
				<img src={!!messages.length && process.env.REACT_APP_API_URL + "/" + messages[0].user.avatar} alt="" />
			</div>
			<div className={style.message__list}>
				{
					messages.map(message => {
						return (
							<MessageContent contextMenu={contextMenu} onContextMenu={onContextMenu} isScrollBottom={isScrollBottom} windowChatRef={windowChatRef} key={message.id} content={message} isOther={message.userId == user.user.id ? false : true} onVisible={handleVisible} isRead={hash == user.user.id ? true : message.isRead} load={message.load ? message.load : false} />
						)
					})
				}
			</div>
		</div >
	)
})

export default Message