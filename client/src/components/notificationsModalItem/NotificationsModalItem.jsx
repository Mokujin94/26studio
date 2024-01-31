import React, { useContext } from 'react'

import style from './notificationsModalItem.module.scss'

import avatar from '../../resource/graphics/images/profile/avatar.jpg'
import { Context } from '../..'
import { observer } from 'mobx-react-lite'



const NotificationsModalItem = observer(({notification}) => {
  const { user } = useContext(Context)
  console.log(notification);

  const add =
    <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 12 12" fill="none">
      <path d="M6 11.5C9.03757 11.5 11.5 9.03757 11.5 6C11.5 2.96243 9.03757 0.5 6 0.5C2.96243 0.5 0.5 2.96243 0.5 6C0.5 9.03757 2.96243 11.5 6 11.5Z" fill="#97BCE6" stroke="#222C36" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M3.21875 5.99995H5.99653ZM5.99653 5.99995H8.77431ZM5.99653 5.99995V3.22217ZM5.99653 5.99995V8.77772Z" fill="white"/>
      <path d="M3.21875 5.99995H5.99653M5.99653 5.99995H8.77431M5.99653 5.99995V3.22217M5.99653 5.99995V8.77772" stroke="#222C36" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>

  const like =
    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="13" viewBox="0 0 12 13" fill="none">
      <path d="M1.36143 1.5356L1.3614 1.53557L1.357 1.54073C0.829673 2.15929 0.5 2.99284 0.5 3.93255C0.5 4.86002 0.831121 5.69044 1.35266 6.31921L1.35262 6.31924L1.357 6.32438L5.6195 11.3244L6 11.7707L6.3805 11.3244L10.643 6.32438C11.1703 5.70581 11.5 4.87226 11.5 3.93255C11.5 3.00508 11.1689 2.17466 10.6473 1.54589L10.6474 1.54586L10.643 1.54073C10.1159 0.922455 9.37197 0.5 8.5 0.5C7.63847 0.5 6.89716 0.924164 6.36143 1.5356L6.3614 1.53557L6.357 1.54073C6.2239 1.69686 6.10339 1.86669 5.99759 2.04846C5.89394 1.86963 5.77648 1.70158 5.64734 1.54589L5.64738 1.54586L5.643 1.54073C5.11592 0.922455 4.37197 0.5 3.5 0.5C2.63847 0.5 1.89716 0.924164 1.36143 1.5356Z" fill="#FF9595" stroke="#222C36"/>
    </svg>
  
  const comment =
    <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 12 12" fill="none">
      <path d="M3.77561 5.16667H8.22005ZM3.77561 7.38889H5.44227ZM11 6C11 8.76144 8.76144 11 6 11C4.86866 11 1.0004 11 1.0004 11C1.0004 11 1.86662 8.92006 1.51995 8.22267C1.18714 7.55311 1 6.79844 1 6C1 3.23858 3.23857 1 6 1C8.76144 1 11 3.23858 11 6Z" fill="#97BCE6"/>
      <path d="M3.77561 5.16667H8.22005M3.77561 7.38889H5.44227M11 6C11 8.76144 8.76144 11 6 11C4.86866 11 1.0004 11 1.0004 11C1.0004 11 1.86662 8.92006 1.51995 8.22267C1.18714 7.55311 1 6.79844 1 6C1 3.23858 3.23857 1 6 1C8.76144 1 11 3.23858 11 6Z" stroke="#222C36" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>

  return (
    <div className={style.item}>
      <div className={style.item__avatar}>
        <img className={style.item__avatarImg} src={process.env.REACT_APP_API_URL + notification.sender.avatar} alt="" />
        <div className={style.item__avatarIcon}>
          {
            notification.likeId && like
          }
          {
            notification.commentId && comment
          }
          {
            !notification.likeId && !notification.commentId && add
          }
        </div>
      </div>
      <div className={style.item__content}>
        <h3 className={style.item__contentName}>{notification.sender.name}</h3>
          {
          notification.likeId
          && <p className={style.item__contentText}>
              Оценил ваш <span className={style.item__contentText_primary}>проект</span>
            </p>
          }
          {
          notification.commentId
          && <p className={style.item__contentText}>
              Оставил <span className={style.item__contentText_primary}>комментарий</span>
            </p>
          }
          {
          !notification.likeId && !notification.commentId
          && <p className={style.item__contentText}>
              Хочет добавить вас в друзья
            </p>
          }
        <span className={style.item__contentTime}>7 минут назад</span>
      </div>
    </div>
  )
})

export default NotificationsModalItem