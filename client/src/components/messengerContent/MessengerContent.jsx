import React from 'react'
import style from './messengerContent.module.scss'
import MessengerInteraction from '../messengerInteraction/MessengerInteraction'
import Message from '../message/Message'
function MessengerContent() {
	return (
		<div className={style.content}>
			<div className={style.content__header}>
				<div className={style.content__headerInfo}>
					<span className={style.content__headerInfoName}>Имя</span>
					<span className={style.content__headerInfoOnline}>Был в сети 3 мин назад</span>
				</div>
			</div>
			<div className={style.content__inner}>
				{/* <span className={style.content__innerText}>Выберите, кому хотели бы написать</span> */}
				<Message isOther={true} count={3} />
				<Message isOther={false} count={1} />
				<Message isOther={true} count={1} />
				<Message isOther={false} count={1} />
				<Message isOther={true} count={4} />
				<Message isOther={false} count={1} />
				<Message isOther={true} count={4} />
				<Message isOther={true} count={4} />
				<Message isOther={false} count={4} />
				<Message isOther={true} count={4} />
				<Message isOther={true} count={4} />
				<Message isOther={true} count={4} />


			</div>
			<div className={style.content__bottom}>
				<MessengerInteraction />
			</div>
		</div>
	)
}

export default MessengerContent