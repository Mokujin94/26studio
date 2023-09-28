import React, { useState } from "react";

import style from "./registrationStages.module.scss";

function RegistrationStages({ stages, setStages }) {
  return (
    <div className={style.stages}>
      <div className={style.stages__item} onClick={() => setStages(1)}>
        <div
          className={`${style.stages__itemNum} ${style.stages__itemNum_active}`}
        >
          1
        </div>
        <span className={style.stages__itemText}>Основная информация</span>
      </div>
      <span
        className={`${
          stages > 1
            ? style.stages__line + " " + style.stages__line_active
            : style.stages__line
        }`}
      ></span>
      <div className={style.stages__item} onClick={() => setStages(2)}>
        <div
          className={`${
            stages > 1
              ? style.stages__itemNum + " " + style.stages__itemNum_active
              : style.stages__itemNum
          }`}
        >
          2
        </div>
        <span className={style.stages__itemText}>
          Дополнительная информация
        </span>
      </div>
      <span
        className={`${
          stages > 2
            ? style.stages__line + " " + style.stages__line_active
            : style.stages__line
        }`}
      ></span>
      <div className={style.stages__item} onClick={() => setStages(3)}>
        <div
          className={`${
            stages > 2
              ? style.stages__itemNum + " " + style.stages__itemNum_active
              : style.stages__itemNum
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
