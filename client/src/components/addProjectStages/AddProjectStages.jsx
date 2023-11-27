import React from "react";

import style from "./addProjectStages.module.scss";

function AddProjectStages({ stages, setStages }) {
  return (
    <div className={style.block}>
      <div className={style.block__item} onClick={() => setStages(2)}>
        <div className={stages >= 2 ? style.block__itemCircle + " " + style.block__itemCircle_active : style.block__itemCircle}></div>
        <span className={style.block__itemTitle}>Информация</span>
      </div>
      <span className={stages === 3 ? style.block__line + " " + style.block__line_active : style.block__line}></span>
      <div className={style.block__item} onClick={() => setStages(3)}>
        <div className={stages === 3 ? style.block__itemCircle + " " + style.block__itemCircle_active : style.block__itemCircle}></div>
        <span className={style.block__itemTitle}>Доступность</span>
      </div>
    </div>
  );
}

export default AddProjectStages;
