import React from 'react';

import style from './groupCard.module.scss';

function GroupCard({ group }) {
  return (
    <div className={style.groupCard}>
      <span className={style.groupCard__yourGroup}>Ваша группа</span>
      <h2 className={style.groupCard__title}>{group.name}</h2>
      <span className={style.groupCard__studentsCount}>Участников: 21</span>
    </div>
  );
}

export default GroupCard;
