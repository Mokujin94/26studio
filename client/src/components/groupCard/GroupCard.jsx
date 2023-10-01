import React from 'react';

import style from './groupCard.module.scss';

function GroupCard() {
  return (
    <div className={style.groupCard}>
      <span className={style.groupCard__yourGroup}>Ваша группа</span>
      <h2 className={style.groupCard__title}>ИС 31/9</h2>
      <span className={style.groupCard__studentsCount}>Участников: 21</span>
    </div>
  );
}

export default GroupCard;
