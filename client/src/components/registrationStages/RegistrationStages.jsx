import React, { useContext, useState } from "react";

import style from "./registrationStages.module.scss";
import { Context } from "../..";

function RegistrationStages({ stages, setStages }) {
  const { user } = useContext(Context);

  const isErrorStage1 = () => {
    if (user.errorAuth === true && stages === 1) {
      alert("Заполните все поля верно!!!!!");
    } else {
      setStages(1);
    }
  };

  const isErrorStage2 = () => {
    if (user.errorAuth === true) {
      alert("Заполните все поля верно!!!!!");
    } else {
      setStages(2);
    }
  };

  const isErrorStage3 = () => {
    if (user.errorAuth === true) {
      alert("Заполните все поля верно!!!!!");
    } else {
      setStages(3);
    }
  };

  return (
    <div className={style.stages}>
      <div className={style.stages__item} onClick={isErrorStage1}>
        <div className={`${style.stages__itemNum} ${style.stages__itemNum_active}`}>1</div>
        <span className={style.stages__itemText}>Основная информация</span>
      </div>
      <span
        className={`${stages > 1 ? style.stages__line + " " + style.stages__line_active : style.stages__line}`}
      ></span>
      <div className={style.stages__item} onClick={isErrorStage2}>
        <div
          className={`${
            stages > 1 ? style.stages__itemNum + " " + style.stages__itemNum_active : style.stages__itemNum
          }`}
        >
          2
        </div>
        <span className={style.stages__itemText}>Дополнительная информация</span>
      </div>
      <span
        className={`${stages > 2 ? style.stages__line + " " + style.stages__line_active : style.stages__line}`}
      ></span>
      <div className={style.stages__item} onClick={isErrorStage3}>
        <div
          className={`${
            stages > 2 ? style.stages__itemNum + " " + style.stages__itemNum_active : style.stages__itemNum
          }`}
        >
          3
        </div>
        <span className={style.stages__itemText}>Завершение</span>
      </div>
    </div>
  );
}

export default RegistrationStages;
