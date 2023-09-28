import React from "react";
import { Link } from "react-router-dom";

import style from "./firstStageReg.module.scss";

import eye from "../../resource/graphics/icons/registration/regEye.svg";
import RegistrationButton from "../registrationButton/RegistrationButton";
function FirstStageReg({ setStages, setClick }) {
  return (
    <>
      <div className={style.first}>
        <div className={style.first__inner}>
          <div className={style.first__row}>
            <label className={style.first__item}>
              <h3 className={style.first__itemTitle}>Никнейм</h3>
              <input type="text" className={style.first__itemInput} />
            </label>
            <label className={style.first__item}>
              <h3 className={style.first__itemTitle}>ФИО</h3>
              <input type="text" className={style.first__itemInput} />
            </label>
          </div>
          <label className={`${style.first__item} ${style.first__itemEmail}`}>
            <h3 className={style.first__itemTitle}>Почта</h3>
            <input type="text" className={style.first__itemInput} />
          </label>
          <div className={style.first__row}>
            <label className={style.first__item}>
              <h3 className={style.first__itemTitle}>Пароль</h3>
              <div className={style.first__itemBottom}>
                <input
                  type="text"
                  className={`${style.first__itemInput} ${style.first__itemInputPass}`}
                />
                <img src={eye} alt="" />
              </div>
            </label>
            <label className={style.first__item}>
              <h3 className={style.first__itemTitle}>Повтор пароля</h3>
              <div className={style.first__itemBottom}>
                <input
                  type="text"
                  className={`${style.first__itemInput} ${style.first__itemInputPass}`}
                />
                <img src={eye} alt="" />
              </div>
            </label>
          </div>
        </div>
      </div>
    </>
  );
}

export default FirstStageReg;
