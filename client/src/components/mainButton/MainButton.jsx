import React, { useContext } from 'react';
import { Link } from 'react-router-dom';

import style from './mainButton.module.scss';
import { Context } from '../..';

function MainButton({ path, title }) {
  const { user } = useContext(Context);
  return (
    <div className={style.btn} onClick={() => user.setBurgerActive(false)}>
      <Link to={path} className={style.btnText}>
        {title}
      </Link>
    </div>
  );
}

export default MainButton;
