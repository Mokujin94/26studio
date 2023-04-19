import React from 'react'

function AchievementProgress() {
  return (
    <div className={style.AchievementProgress}>
        <div className={style.AchievementProgress__title}></div>
        <div className={style.AchievementProgress__progress}></div>
        <div className={style.AchievementProgress__achievements}>
            <div className={style.AchievementProgress__achievements__achievement}>
                <div className={style.AchievementProgress__achievements__achievement__count}></div>
                <div className={style.AchievementProgress__achievements__achievement__icon}></div>
                <div className={style.AchievementProgress__achievements__achievement__title}></div>
            </div>
        </div>
    </div>
  )
}

export default AchievementProgress