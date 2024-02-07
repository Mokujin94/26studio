import React, { useContext } from 'react';
import { Link } from 'react-router-dom';

import style from './mainButton.module.scss';
import { Context } from '../..';

function MainButton({ path, title, onClick }) {
  const { user } = useContext(Context);
  return (
    <div className={style.btn} onClick={() => {
      user.setBurgerActive(false);
      onClick()
    }}>
      <Link to={path} className={style.btnText}>
        {title}
      </Link>
    </div>
  );
}

export default MainButton;
