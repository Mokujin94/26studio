import React from 'react'

import style from './projectContent.module.scss'
import photo from '../../resource/graphics/images/projectCard/bg.jpg'

function ProjectContent() {
  return (
    <div className={style.block}>
        <img className={style.block__img} src={photo} alt="" />
    </div>
  )
}

export default ProjectContent