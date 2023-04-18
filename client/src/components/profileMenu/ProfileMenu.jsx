import React from 'react'

import style from './profileMenu.module.scss'

function ProfileMenu() {
  return (
    <div className={style.menu}>
        <div className={style.menu__select}>Проекты</div>
        <div className={style.menu__select}>Друзья</div>
        <div className={style.menu__select}>Награды</div>
        <div className={style.menu__select}>Настройки</div>
    </div>
  )
}

export default ProfileMenu