import React from "react";

import style from "./amountComponent.module.scss";

function AmountComponent({ img, value, onClick, likeLoading }) {
  return (
    <button disabled={likeLoading} className={style.block} onClick={onClick}>
      {img(style)}
      <div className={style.block__amount}>{value}</div>
    </button>
  );
}

export default AmountComponent;
