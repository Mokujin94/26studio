import React from 'react'

import style from './profileMenu.module.scss'

function ProfileMenu({onSelected, selected}) {
  const menuElements = [
    {id: 0, title: 'Проекты'},
    {id: 1, title: 'Друзья'},
    {id: 2, title: 'Награды'},
    {id: 3, title: 'Настройки'}
  ]

  const menuElement = menuElements.map(({id, title}) => {
    return (
      <div onClick={() => onSelected(id)} className={selected === id ? `${style.menu__select} ${style.menu__select__active}` : style.menu__select} key={id}>{title}</div>
    )
  })

  return (
    <div className={style.menu}>
        {menuElement}
    </div>
  )
}

export default ProfileMenu