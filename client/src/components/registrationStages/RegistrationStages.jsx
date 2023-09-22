import React, { useState } from "react";

import style from "./registrationStages.module.scss";

function RegistrationStages() {
  const [stages, setStages] = useState(1);

  return (
    <div className={style.stages}>
      <div className={style.stages__item}>
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
      <div className={style.stages__item}>
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
      <div className={style.stages__item}>
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
      <button onClick={() => setStages((item) => item + 1)}>bbb</button>
    </div>
  );
}

export default RegistrationStages;
