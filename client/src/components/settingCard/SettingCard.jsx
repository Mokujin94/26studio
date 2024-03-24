import React from 'react'

import style from './settingCard.module.scss'
import { observer } from 'mobx-react-lite'
import FunctionButton from '../functionButton/FunctionButton'

const SettingCard = observer(({children}) => {
  return (
    <div className={style.card}>
        <h2 className={style.title}>Изменить пароль</h2>
        <form>
            <input type="text" className={style.input__full} placeholder='Старый пароль'/>
            <div className={style.input__wrapper}>
                {children}
            </div>
            <div className={style.button}>
                <FunctionButton>Сохранить</FunctionButton>
            </div>
        </form>
    </div>
  )
})

export default SettingCard