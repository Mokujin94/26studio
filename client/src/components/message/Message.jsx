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
				<TransitionGroup component={null}>
					{
						messages.map(message => {
							if (message.userId == user.user.id) {

								return (
									<CSSTransition
										key={message.id}
										timeout={200} // Время анимации в миллисекундах
										classNames="message" // Префикс классов для анимации
									>
										<div className={style.message__list_item}>
											<MessageContent content={message.text} isOther={false} />
										</div>
									</CSSTransition>
								)
							} else {
								return (
									<CSSTransition
										key={message.id}
										timeout={200} // Время анимации в миллисекундах
										classNames="message" // Префикс классов для анимации
									>

										<div className={style.message__list_item + ' ' + style.message__list_item_other}>
											<MessageContent content={message.text} isOther={true} />
										</div>
									</CSSTransition>
								)
							}
							console.log(message)
						})
					}
				</TransitionGroup>
			</div>
		</div >
	)
})

export default Message