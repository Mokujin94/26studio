import React from 'react'
import style from './messengerContent.module.scss'
import MessengerInteraction from '../messengerInteraction/MessengerInteraction'
function MessengerContent() {
	return (
		<div className={style.content}>
            <div className={style.content__header}>
				<div className={style.content__headerInfo}>
                    <span className={style.content__headerInfoName}>Имя</span>
                    <span className={style.content__headerInfoOnline}>Был в сети 3 мин назад</span>
				</div>
			</div>
            <div className={style.content__inner + " " + style.content__inner_active}>
                Выберите, кому хотели бы написать
            </div>
            <div className={style.content__bottom}>
                <MessengerInteraction/>
            </div>
		</div>
	)
}

export default MessengerContent