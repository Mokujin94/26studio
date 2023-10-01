import React, { useRef, useState } from 'react';

import style from './spSelectMobile.module.scss';

import selectIcon from '../../resource/graphics/icons/group/group_select_icon.svg';
import { CSSTransition } from 'react-transition-group';

function SpSelectMobile() {
  const [selectActive, setSelectActive] = useState(false);
  return (
    <div className={selectActive ? `${style.spSelectMobile} ${style.spSelectMobile_active}` : style.spSelectMobile}>
      <div className={style.spSelectMobile__top} onClick={() => setSelectActive((item) => !item)}>
        <div className={style.spSelectMobile__title}>Выбор СП</div>
        <img className={style.spSelectMobile__img} src={selectIcon} alt="" />
      </div>
      <div className={style.spSelectMobile__wrapper}>
        <div className={style.spSelectMobile__item}>СП1</div>
        <div className={style.spSelectMobile__item}>СП2</div>
        <div className={style.spSelectMobile__item}>СП3</div>
        <div className={style.spSelectMobile__item}>СП4</div>
        <div className={style.spSelectMobile__item}>СП5</div>
        <div className={style.spSelectMobile__item}>СП6</div>
        <div className={style.spSelectMobile__item}>СП7</div>
        <div className={style.spSelectMobile__item}>СП8</div>
        <div className={style.spSelectMobile__item}>СП9</div>
        <div className={style.spSelectMobile__item}>СП10</div>
        <div className={style.spSelectMobile__item}>СП11</div>
        <div className={style.spSelectMobile__item}>СП13</div>
      </div>
    </div>
  );
}

export default SpSelectMobile;
