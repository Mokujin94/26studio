import React from "react";

import style from "./amountComponent.module.scss";

function AmountComponent({ img, value, onClick }) {
  return (
    <div className={style.block} onClick={onClick}>
      {img(style)}
      <div className={style.block__amount}>{value}</div>
    </div>
  );
}

export default AmountComponent;
