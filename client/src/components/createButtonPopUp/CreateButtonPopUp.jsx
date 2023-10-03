import React, { useState } from "react";
import style from "./createButtonPopUp.module.scss";
import "./createAnim.scss";

import cross from "../../resource/graphics/icons/createButtonPopUp/createButtonCross.svg";
import addProject from "../../resource/graphics/icons/createButtonPopUp/addProject.svg";
import addNews from "../../resource/graphics/icons/createButtonPopUp/addNews.svg";
import { CSSTransition } from "react-transition-group";

function CreateButtonPopUp() {
  const [active, setActive] = useState(false);

  return (
    <div
      onClick={() => setActive((item) => !item)}
      className={
        active ? `${style.button} ${style.button_active}` : style.button
      }
    >
      <svg
        className={style.button__cross}
        xmlns="http://www.w3.org/2000/svg"
        width="22"
        height="22"
        viewBox="0 0 22 22"
      >
        <path d="M1 11.0901H21Z" fill="#27323E" />
        <path
          d="M1 11.0901H21"
          stroke="#FCFCFC"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
        <path d="M11 21L11 1Z" fill="#27323E" />
        <path
          d="M11 21L11 1"
          stroke="#FCFCFC"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </svg>
      <CSSTransition
        in={active}
        timeout={300}
        classNames="create-anim"
        mountOnEnter
        unmountOnExit
      >
        <div
          className={
            active
              ? `${style.button__content} ${style.button__content_active}`
              : style.button__content
          }
          onClick={(e) => e.stopPropagation()}
        >
          <div className={style.button__contentItem}>
            <img
              className={style.button__contentItemImg}
              src={addProject}
              alt=""
            />
            Добавить проект
          </div>
          <div className={style.button__contentItem}>
            <img
              className={style.button__contentItemImg}
              src={addNews}
              alt=""
            />
            Предложить новость
          </div>
        </div>
      </CSSTransition>
    </div>
  );
}

export default CreateButtonPopUp;
