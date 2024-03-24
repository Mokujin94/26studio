import React from 'react'
import SettingCard from '../settingCard/SettingCard'

import style from '../settingCard/settingCard.module.scss'


function ProfileSettings() {
  return (
    <>
        <SettingCard>
            <input type="text" className={style.input__2fr} placeholder='Новый пароль'/>
            <input type="text" className={style.input__2fr} placeholder='Повторите пароль'/>
        </SettingCard>
        <SettingCard>
            <input type="text" className={style.input__2fr} placeholder='Новый пароль'/>
        </SettingCard>
        <SettingCard>
            <input type="text" className={style.input__2fr} placeholder='Новый пароль'/>
        </SettingCard>
    </>
  )
}

export default ProfileSettings