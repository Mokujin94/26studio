import React, { useContext } from 'react'
import style from './profileMiniatureModal.module.scss'
import FunctionButton from '../functionButton/FunctionButton'
import { Context } from '../..'

function ProfileMiniatureModal({ reader }) {
  const { user } = useContext(Context)
  
  const onButton = () => {
    user.setModalProfileMiniature(false);
  } 
  
  return (
    <div className={style.miniature} onClick={(e) => e.stopPropagation()}>
      <img className={style.miniatureImg} src={reader} alt="" />
      <div className={style.miniatureBtn}>
        <FunctionButton onclick={onButton}>Загрузить фотографию</FunctionButton>
      </div>
    </div>
  )
}

export default ProfileMiniatureModal