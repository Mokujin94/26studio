import React from "react";

import style from "./addProjectStages.module.scss";

function AddProjectStages({ setStages }) {
  return (
    <div className={style.block}>
      <div className={style.block__item} onClick={() => setStages(2)}>
        <div className={style.block__itemCircle}></div>
        <span className={style.block__itemTitle}>Информация</span>
      </div>
      <span className={style.block__line}></span>
      <div className={style.block__item} onClick={() => setStages(3)}>
        <div className={style.block__itemCircle}></div>
        <span className={style.block__itemTitle}>Доступность</span>
      </div>
    </div>
  );
}

export default AddProjectStages;
