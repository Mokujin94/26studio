import React, { useContext } from 'react'

import style from './profileMenu.module.scss'
import { Context } from '../..'
import { observer } from 'mobx-react-lite'

const ProfileMenu = observer(() => {
  const {profile} = useContext(Context)

  return (
    <div className={style.menu}>
        {profile.menuItems.map(item => 
          <div
           onClick={() => profile.setSelectedMenu(item)} 
           className={item.id === profile.selectedMenu.id ? `${style.menu__select} ${style.menu__select__active}` : style.menu__select} 
           key={item.id}
          > 
           {item.title} 
          </div>
        )}
    </div>
  )
})

export default ProfileMenu