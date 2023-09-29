import React, { useState } from 'react'
import style from './createButtonPopUp.module.scss'

import cross from '../../resource/graphics/icons/createButtonPopUp/createButtonCross.svg'
import addProject from '../../resource/graphics/icons/createButtonPopUp/addProject.svg'
import addNews from '../../resource/graphics/icons/createButtonPopUp/addNews.svg'

function CreateButtonPopUp() {

  const [active, setActive] = useState(false);
  

  return (
    <div>
      <div className={style.button__wrapper} onClick={() => setActive(item => !item)}>
        <div className={active ? `${style.button} ${style.button_active}` : style.button}>
          <img src={cross} alt='icon' className={style.button__cross}/>
          <div className={active ? `${style.button__content} ${style.button__content_active}` : style.button__content} onClick={e => e.stopPropagation()}>
            <div className={style.button__contentItem}>
              <img className={style.button__contentItemImg} src={addProject} alt="" />
              Добавить проект
            </div>
            <div className={style.button__contentItem}>
              <img className={style.button__contentItemImg} src={addNews} alt="" />
              Предложить новость
            </div>

          </div>
        </div>
        </div> 
    </div>
  )
}

export default CreateButtonPopUp