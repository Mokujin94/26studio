import React, { useState } from "react";
import style from "./themeChangeButton.module.scss";
import "./themeChangeAnim.scss";

import { CSSTransition } from "react-transition-group";

function ThemeChangeButton() {
  const [active, setActive] = useState(false);

  return (
    <div
      onClick={() => setActive((item) => !item)}
      className={
        active
          ? `${style.themeChangeButton} ${style.themeChangeButton_active}`
          : style.themeChangeButton
      }
    >
      <svg
        className={style.brushIcon}
        width="20"
        height="20"
        viewBox="0 0 20 20"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M7.49982 9.35183L10.648 12.5M6.64554 17.479C5.50651 18.6181 3.33317 18.3333 1.6665 18.3333C2.52075 16.6666 1.38172 14.4933 2.52075 13.3543C3.65978 12.2152 5.50651 12.2152 6.64554 13.3543C7.78457 14.4933 7.78457 16.34 6.64554 17.479ZM9.9345 13.2705L17.5488 5.0471C18.2194 4.32279 18.1978 3.19797 17.4998 2.49998C16.8018 1.80199 15.677 1.78036 14.9527 2.45101L6.72928 10.0653C6.30434 10.4587 6.09186 10.6555 5.96794 10.8653C5.67079 11.3684 5.65883 11.9904 5.93643 12.5046C6.05219 12.719 6.25695 12.9238 6.66646 13.3333C7.07597 13.7428 7.28072 13.9476 7.49515 14.0633C8.00934 14.3409 8.63135 14.329 9.13448 14.0318C9.3443 13.9079 9.54104 13.6954 9.9345 13.2705Z"
          stroke="white"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </svg>
      <CSSTransition
        in={active}
        timeout={300}
        classNames="themeChange-anim"
        mountOnEnter
        unmountOnExit
      >
        <div
          className={
            active
              ? `${style.themeChangeButton__popUp} ${style.themeChangeButton__popUp_active}`
              : style.themeChangeButton__popUp
          }
          onClick={(e) => e.stopPropagation()}
        >
          <h2 className={style.themeChangeButton__title}>Тема сайта</h2>

          <div className={style.themeChangeButton__popUpThemes}>
            <div
              className={
                style.themeChangeButton__item +
                " " +
                style.themeChangeButton__item_black
              }
            ></div>
            <div
              className={
                style.themeChangeButton__item +
                " " +
                style.themeChangeButton__item_blue
              }
            ></div>
            <div
              className={
                style.themeChangeButton__item +
                " " +
                style.themeChangeButton__item_white
              }
            ></div>
          </div>
        </div>
      </CSSTransition>
    </div>
  );
}

export default ThemeChangeButton;
