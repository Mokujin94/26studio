import React from 'react';

import style from './spSelect.module.scss';

function SpSelect() {
  return (
    <div className={style.spSelect}>
      <div className={style.spSelect__title}>Выбор СП</div>
      <div className={style.spSelect__wrapper}>
        <div className={style.spSelect__item}>СП1</div>
        <div className={style.spSelect__item}>СП2</div>
        <div className={style.spSelect__item}>СП3</div>
        <div className={style.spSelect__item}>СП4</div>
        <div className={style.spSelect__item}>СП5</div>
        <div className={style.spSelect__item}>СП6</div>
        <div className={style.spSelect__item}>СП7</div>
        <div className={style.spSelect__item}>СП8</div>
        <div className={style.spSelect__item}>СП9</div>
        <div className={style.spSelect__item}>СП10</div>
        <div className={style.spSelect__item}>СП11</div>
        <div className={style.spSelect__item}>СП12</div>
        <div className={style.spSelect__item}>СП13</div>
      </div>
    </div>
  );
}

export default SpSelect;
