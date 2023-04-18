import React from "react";

import style from "./description.module.scss";

function Description(props) {
  return (
    <div className={style.block}>
      <div className={style.block__title}>{props.title}</div>
      <div className={style.block__descr}>{props.descr}</div>
    </div>
  );
}

export default Description;
