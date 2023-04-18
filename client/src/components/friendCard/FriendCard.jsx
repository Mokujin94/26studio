import React from 'react'
import style from './friendCard.module.scss'

import avatar from '../../resource/graphics/images/profile/avatar.jpg'
import message from '../../resource/graphics/icons/friendCard/message.svg'
import deleteFriend from '../../resource/graphics/icons/friendCard/delete.svg'

function FriendCard() {
  return (
    <div className={style.friendCard}>
        <div className={style.friendCard__avatar}>
            <img src={avatar} alt="img" className={style.friendCard__avatar__img} />
        </div>
        <div className={style.friendCard__info}>
            <div className={style.friendCard__info__nick}>
                <h2 className={style.friendCard__info__nick__nickName}>Br1eze</h2>
                <div className={style.friendCard__info__nick__achievement}>

                </div>
            </div>
            <div className={style.friendCard__info__name}>
                <h2 className={style.friendCard__info__name__fullname}>Ролдугин Илья</h2>
                <h2 className={style.friendCard__info__name__group}>ИС 31/9</h2>
            </div>
            <h2 className={style.friendCard__info__online}>был в сети: 4ч назад</h2>
        </div>
        <div className={style.friendCard__buttons}>
            <div className={style.friendCard__buttons__item}>
            <img src={message} alt="img" className={style.friendCard__buttons__item__icon} />
            </div>
            <div className={style.friendCard__buttons__item}>
            <img src={deleteFriend} alt="img" className={style.friendCard__buttons__item__icon} />
                
            </div>
        </div>
    </div>
  )
}

export default FriendCard