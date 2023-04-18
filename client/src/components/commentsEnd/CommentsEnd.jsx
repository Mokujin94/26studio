import React from 'react'

import style from './commentsEnd.module.scss'

function CommentsEnd() {
  return (
    <div className={style.block}>
        <input className={style.block__input} type="text" placeholder='Напишите текст'/>
        <button type='submit' className={style.block__btn}>Отправить</button>
    </div>
  )
}

export default CommentsEnd