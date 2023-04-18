import React from 'react'

import style from './newsPaperContent.module.scss'
import photo from '../../resource/graphics/images/profile/avatar.jpg'

function NewsPaperContent() {
  return (
    <div className={style.block}>
        <img className={style.block__img} src={photo} alt="" />
    </div>
  )
}

export default NewsPaperContent