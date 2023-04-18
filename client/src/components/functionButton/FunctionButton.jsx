

import React from 'react'

import style from './functionButton.module.scss'

function FunctionButton({children}) {
  return (
    <div className={style.button}>
        <h2 className={style.button__text}>{children}</h2>
    </div>
  )
}

export default FunctionButton