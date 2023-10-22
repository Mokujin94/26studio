import React from 'react';

import style from './amountComponent.module.scss';

function AmountComponent({ img, value }) {
  return (
    <div className={style.block}>
      <img src={img} alt="" className={style.block__img} />
      <div className={style.block__amount}>{value}</div>
    </div>
  );
}

export default AmountComponent;
