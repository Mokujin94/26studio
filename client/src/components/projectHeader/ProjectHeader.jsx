import React from 'react'
import AmountComponent from '../amountComponent/AmountComponent'

import like from "../../resource/graphics/icons/newsCard/likes.svg";
import view from "../../resource/graphics/icons/newsCard/views.svg";



import style from "./projectHeader.module.scss"


function ProjectHeader(props) {
  return (
    <div className={style.block}>
      <h2 className={style.block__title}>{props.title}</h2>
      <div className={style.block__right}>
        <AmountComponent img={like} value="54"/>
        <AmountComponent img={view} value="23232"/>
      </div>
    </div>
  )
}

export default ProjectHeader