import React from 'react'

import style from './projectTags.module.scss'

function ProjectTags() {
  return (
    <div className={style.projectTags}>
        <div className={style.title}>Тэги:</div>
        <div className={style.tags__wrapper}>
            <div className={style.tag}>#Design</div>
            <div className={style.tag}>#Design</div>
            <div className={style.tag}>#Design</div>
            <div className={style.tag}>#Design</div>
            <div className={style.tag}>#Design</div>
        </div>
        
    </div>
  )
}

export default ProjectTags