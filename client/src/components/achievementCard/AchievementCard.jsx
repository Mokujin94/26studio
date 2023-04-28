import React from 'react'
import style from './achievementCard.module.scss'
import achievement from '../../resource/graphics/icons/achievements/achievement.png'
import ask from '../../resource/graphics/icons/profile/ask.svg'


function AchievementCard() {
  return (
    <div className={style.achievement}>
        <div className={style.achievement__info}>
            <img src={achievement} alt="icon" className={style.achievement__info__icon} />
        </div>
        <div data-title="Ваш проект должен занять первое место среди всех проектов за месяц" className={style.achievement__icon}>
            <img src={ask} alt="icon" className={style.achievement__icon__img} />
        </div>
        <h2 className={style.achievement__title}>Проект недели</h2>
        <h2 className={style.achievement__getDate}>получено: 03.04.23</h2>
    </div>
  )
}

export default AchievementCard