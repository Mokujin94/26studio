import React from 'react'
import style from './profileAchievements.module.scss'

import AchievementCard from '../achievementCard/AchievementCard'
import ProgressAchievement from '../progressAchievement/ProgressAchievement'

function ProfileAchievements() {
  return (
    <div className='flex'>
        <div className={style.wrapper__6fr}>
            <AchievementCard/>
            <AchievementCard/>
            <AchievementCard/>
            <AchievementCard/>
            <AchievementCard/>
            <AchievementCard/>
            <AchievementCard/>
            <AchievementCard/>
            <AchievementCard/>
            <AchievementCard/>
            <AchievementCard/>
            <AchievementCard/>
            <AchievementCard/>
            <AchievementCard/>
        </div>
        <div className={style.wrapper__2fr}>
            <ProgressAchievement/>
            <ProgressAchievement/>
            <ProgressAchievement/>
            <ProgressAchievement/>
        </div>
    </div>
    )
}

export default ProfileAchievements