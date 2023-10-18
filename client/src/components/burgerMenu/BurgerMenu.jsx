import React, { useContext, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  MESSENGER_ROUTE,
  NEWS_ROUTE,
  PROFILE_ROUTE,
  PROJECTS_ROUTE,
  GROUPS_ROUTE,
  REGISTRATION_ROUTE,
  LOGIN_ROUTE,
} from '../../utils/consts';
import MainButton from '../mainButton/MainButton';

import style from './burgerMenu.module.scss';

import close from '../../resource/graphics/icons/burgerMenu/closeIcon.svg';
import avatar from '../../resource/graphics/images/burgerMenu/avatar.jpg';
import { observer } from 'mobx-react-lite';
import { Context } from '../..';

const BurgerMenu = observer(() => {
  const { user } = useContext(Context);

  const burgerTrigger = () => {
    user.setBurgerActive(!user.burgerActive);
  };

  return (
    <>
      <div className={user.burgerActive ? style.burgerActive : style.burger}>
        <div className={style.close} onClick={() => burgerTrigger()}>
          <img src={close} alt="icon" className={style.closeIcon} />
        </div>
        <div className={style.avatarBlock}>
          <img src={process.env.REACT_APP_API_URL + user.user.avatar} alt="img" className={style.avatar} />
        </div>
        {user.isAuth && <h2 className={style.name}>{user.user.name}</h2>}
        {user.isAuth ? (
          <MainButton path={PROFILE_ROUTE} title={'Перейти в профиль'} onClick={() => burgerTrigger()} />
        ) : (
          <MainButton path={LOGIN_ROUTE} title={'Войти в аккаунт'} onClick={() => burgerTrigger()} />
        )}
        {!user.isAuth && (
          <h2 className={style.notAuth}>
            Нет аккаунта?{' '}
            <Link to={REGISTRATION_ROUTE} className={style.notAuth__path} onClick={() => burgerTrigger()}>
              Регистрация
            </Link>
          </h2>
        )}
        <ul className={style.menu}>
          {user.isAuth
            ? user.menuAuth.map(({ id, title, icon, path }) => {
                return (
                  <Link className={style.menu__item__text} to={path} onClick={() => burgerTrigger()} key={id}>
                    <li className={style.menu__item}>
                      <img src={icon} alt="icon" />
                      {title}
                    </li>
                  </Link>
                );
              })
            : user.menu.map(({ id, title, icon, path }) => {
                return (
                  <Link className={style.menu__item__text} to={path} onClick={() => burgerTrigger()} key={id}>
                    <li className={style.menu__item}>
                      <img src={icon} alt="icon" />
                      {title}
                    </li>
                  </Link>
                );
              })}
        </ul>
      </div>
      <div
        className={!user.burgerActive ? style.popup : `${style.popup} ${style.popup_active}`}
        onClick={() => user.setBurgerActive(false)}
      ></div>
    </>
  );
});

export default BurgerMenu;
