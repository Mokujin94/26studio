import React from "react";

import style from "./amountComponent.module.scss";

function amountComponent(props) {
  return (
    <div className={style.block}>
      <img src={props.img} alt="" className={style.block__img} />
      <div className={style.block__amount}>{props.value}</div>
    </div>
  );
}

export default amountComponent;
