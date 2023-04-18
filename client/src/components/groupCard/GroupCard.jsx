import React from 'react'

import style from './groupCard.module.scss'

function GroupCard() {
    return (
        <div className={style.groupCard}>
            <div className={style.yourGroup}>Ваша группа</div>
            <div className={style.groupName}>ИС 31/9</div>
            <div className={style.studentsCount}>Количество учеников: 21</div>
        </div>
    )
}

export default GroupCard