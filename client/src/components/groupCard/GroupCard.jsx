import React from 'react';

import style from './groupCard.module.scss';
import { Link } from 'react-router-dom';
import { GROUPS_ROUTE } from '../../utils/consts';

function GroupCard({ group }) {
  return (
    <Link to={GROUPS_ROUTE + '/' + group.id} className={style.groupCard}>
      <span className={style.groupCard__yourGroup}>Ваша группа</span>
      <h2 className={style.groupCard__title}>{group.name}</h2>
      <span className={style.groupCard__studentsCount}>Участников: {group.members.length}</span>
    </Link>
  );
}

export default GroupCard;
