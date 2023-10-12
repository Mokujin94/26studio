import React, { useContext } from "react";

import style from "./header.module.scss";

import logo from "../../resource/graphics/icons/footer/footer_logo.svg";
import search from "../../resource/graphics/icons/header/search.svg";
import CreateButtonPopUp from "../createButtonPopUp/CreateButtonPopUp";
import burger from "../../resource/graphics/icons/burgerMenu/burger.svg";
import { Context } from "../..";
import ThemeChangeButton from "../themeChangeButton/ThemeChangeButton";

function Header() {
  const { user } = useContext(Context);

  return (
    <header className={style.header}>
      <div className="container">
        <div className={style.header__wrapper}>
          <div
            className={style.header__burgerBtn}
            onClick={() => user.setBurgerActive(!user.burgerActive)}
            style={{ userSelect: "none" }}
          >
            <img src={burger} alt="icon" />
          </div>
          <img src={logo} alt="logo" className={style.header__logo} />
          <div className={style.header__search}>
            <input
              className={style.header__search__input}
              placeholder="Поиск по сайту"
              onFocus={(event) => {
                event.target.setAttribute("autocomplete", "off");
              }}
            />
            <img
              src={search}
              alt="icon"
              className={style.header__search__icon}
            />
          </div>
          <div className={style.header__createButtonPopUp}>
            <CreateButtonPopUp />
            <ThemeChangeButton />
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;
