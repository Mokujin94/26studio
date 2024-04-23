import React from 'react'
import style from './message.module.scss'
function Message() {
	return (
		<div className={style.message}>
            <div className={style.message__avatar}>

            </div>
            <div className={style.message__inner}>
                <div className={style.message__content}></div>
                <div className={style.message__time}></div>
                <div className={style.message__view}></div>
            </div>
		</div>
	)
}

export default Message