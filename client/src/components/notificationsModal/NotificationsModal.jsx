import React, { useContext, useEffect } from 'react'

import style from './notificationsModal.module.scss'
import NotificationsModalItem from '../notificationsModalItem/NotificationsModalItem'
import { Context } from '../..'
import { observer } from 'mobx-react-lite'
import { fetchNotifications, updateViewNotifications } from '../../http/notificationAPI'

const NotificationsModal = observer(() => {
  const { user } = useContext(Context)

  
  useEffect(() => {
    updateViewNotifications(user.user.id).then(
      fetchNotifications(user.user.id).then(data => {
        user.setNotifications(data)
        console.log(user.notifications);
      })
    )
  }, [user.user.id])

  return (
    <div className={style.block} onClick={(e) => e.stopPropagation()}>
      <h3 className={style.blockTitle}>Уведомления</h3>
      <div className={style.blockList}>
        {
          user.notifications.length ?
          user.notifications.map(item => {
            return <NotificationsModalItem notification={item} />
          })
            : <span className={style.blockListNo}>Нет уведомлений !</span>
        }
      </div>
    </div>
  )
})

export default NotificationsModal