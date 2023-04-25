import React from 'react'
import { Link } from 'react-router-dom'

import style from './mainButton.module.scss'

function MainButton({path, title, setMenu}) {
  return (
    <div className={style.btn} onClick={() => setMenu(false)}>
        <Link to={path} className={style.btnText}>{title}</Link>
    </div>

  )
}

export default MainButton