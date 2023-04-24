import React, { useContext, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
  MESSENGER_ROUTE,
  NEWS_ROUTE,
  PROFILE_ROUTE,
  PROJECTS_ROUTE,
  GROUPS_ROUTE,
} from "../../utils/consts";
import MainButton from "../mainButton/MainButton";

import style from "./burgerMenu.module.scss";

import close from "../../resource/graphics/icons/burgerMenu/closeIcon.svg";
import avatar from "../../resource/graphics/images/burgerMenu/avatar.jpg";
import burger from "../../resource/graphics/icons/burgerMenu/burger.svg";
import { observer } from "mobx-react-lite";
import { Context } from "../..";

const BurgerMenu = observer(() => {
  const { user } = useContext(Context)

  const [active, setActive] = useState(false);

  const burgerTrigger = () => {
    setActive((active) => !active);
  };

  return (
    <>
      <div
        className={style.burgerBtn}
        onClick={() => burgerTrigger()}
        style={{ userSelect: "none" }}
      >
        <img src={burger} alt="icon" />
      </div>
      <div className={active ? style.burgerActive : style.burger}>
        <div className={style.close} onClick={() => burgerTrigger()}>
          <img src={close} alt="icon" className={style.closeIcon} />
        </div>
        <div className={style.avatarBlock}>
          <img src={avatar} alt="img" className={style.avatar} />
        </div>
        <h2 className={style.name}>Mokujin</h2>
        <MainButton path={PROFILE_ROUTE} title={"Перейти в профиль"} />
        <ul className={style.menu}>
          {user.menu.map(({id, title, icon, path}) => {
            return (
              <Link className={style.menu__item__text} to={path} onClick={() => burgerTrigger()} key={id}>
                <li className={style.menu__item}>
                  <img src={icon} alt="icon" />
                  {title}
                </li>
              </Link>
            )
          })}
        </ul>
      </div>
      <div className={!active ? style.popup : `${style.popup} ${style.popup_active}`} onClick={() => setActive(false)}></div>
    </>
  );
})

export default BurgerMenu;
