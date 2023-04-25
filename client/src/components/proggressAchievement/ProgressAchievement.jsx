import React from 'react'
import style from './progressAchievement.module.scss'
import achievement from '../../resource/graphics/icons/achievements/achievement.png'
import AchievementProgress from '../achievement/AchievementProgress'



function ProgressAchievement() {
  return (
    <div className={style.progressAchievement}>
        <div className={style.progressAchievement__info}>
            <div className={style.progressAchievement__info__title}>Прогресс достижений</div>
            <div className={style.progressAchievement__info__progress}>13 / 100%</div>
        </div>
        <div className={style.progressAchievement__achievement}>
            <div className={style.mr30}><AchievementProgress/></div>
            <div className={style.mr30}><AchievementProgress/></div>
            <div className={style.mr30}><AchievementProgress/></div>
            <div className={style.mr30}><AchievementProgress/></div>            
        </div>
    </div>
  )
}

export default ProgressAchievement