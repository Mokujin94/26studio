import React, { useContext } from 'react';

import style from './groupCard.module.scss';
import { Link } from 'react-router-dom';
import { GROUPS_ROUTE } from '../../utils/consts';
import { Context } from '../..';
import { observer } from 'mobx-react-lite';

const GroupCard = observer(({ group }) => {
  const { user } = useContext(Context)
  return (
    <Link to={GROUPS_ROUTE + '/' + group.id} className={style.groupCard}>
      <span className={style.groupCard__yourGroup}>{user.user.groupId === group.id && 'Ваша группа'}</span>
      <h2 className={style.groupCard__title}>{group.name}</h2>
      <span className={style.groupCard__studentsCount}>Участников: {group.users.filter(item => item.group_status).length}</span>
    </Link>
  );
})

export default GroupCard;
