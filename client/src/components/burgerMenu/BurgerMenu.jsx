import React, { useEffect, useRef, useState } from "react";
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
import news from "../../resource/graphics/icons/burgerMenu/newsIcon.svg";
import messeges from "../../resource/graphics/icons/burgerMenu/messegesIcon.svg";
import project from "../../resource/graphics/icons/burgerMenu/projectIcon.svg";
import group from "../../resource/graphics/icons/burgerMenu/groupIcon.svg";
import avatar from "../../resource/graphics/images/burgerMenu/avatar.jpg";
import burger from "../../resource/graphics/icons/burgerMenu/burger.svg";

function BurgerMenu() {
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
          <Link className={style.menu__item__text} to={NEWS_ROUTE}>
            <li className={style.menu__item}>
              <img src={news} alt="icon" />
              Новости
            </li>
          </Link>
          <Link className={style.menu__item__text} to={MESSENGER_ROUTE}>
            <li className={style.menu__item}>
              <img src={messeges} alt="icon" />
              Мессенджер
            </li>
          </Link>
          <Link className={style.menu__item__text} to={PROJECTS_ROUTE}>
            <li className={style.menu__item}>
              <img src={project} alt="icon" />
              Проекты
            </li>
          </Link>
          <Link className={style.menu__item__text} to={GROUPS_ROUTE}>
            <li className={style.menu__item}>
              <img src={group} alt="icon" />
              Группы
            </li>
          </Link>
        </ul>
      </div>
    </>
  );
}

export default BurgerMenu;
