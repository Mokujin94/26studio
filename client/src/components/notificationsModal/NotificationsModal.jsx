import React from 'react'

import style from './notificationsModal.module.scss'
import NotificationsModalItem from '../notificationsModalItem/NotificationsModalItem'

const NotificationsModal = () => {

  return (
    <div className={style.block} onClick={(e) => e.stopPropagation()}>
      <h3 className={style.blockTitle}>Уведомления</h3>
      <div className={style.blockList}>
        <NotificationsModalItem/>
        {/* <NotificationsModalItem/> */}
        {/* <NotificationsModalItem/> */}
      </div>
    </div>
  )
}

export default NotificationsModal