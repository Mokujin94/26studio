import React, { useRef, useState } from "react";

import style from "./spSelectMobile.module.scss";

import selectIcon from "../../resource/graphics/icons/group/group_select_icon.svg";
import { CSSTransition } from "react-transition-group";

function SpSelectMobile() {
	const [selectActive, setSelectActive] = useState(false);
	return (
		<div className={selectActive ? `${style.spSelectMobile} ${style.spSelectMobile_active}` : style.spSelectMobile}>
			<div className={style.spSelectMobile__top} onClick={() => setSelectActive((item) => !item)}>
				<div className={style.spSelectMobile__title}>Выбор СП</div>
				<img className={style.spSelectMobile__img} src={selectIcon} alt="" />
			</div>
			<div className={style.spSelectMobile__wrapper}>
				<button disabled className={style.spSelectMobile__item}>СП1</button>
				<button disabled className={style.spSelectMobile__item}>СП2</button>
				<button disabled className={style.spSelectMobile__item}>СП3</button>
				<button disabled className={style.spSelectMobile__item}>СП4</button>
				<button disabled className={style.spSelectMobile__item}>СП5</button>
				<button disabled className={style.spSelectMobile__item}>СП6</button>
				<button disabled className={style.spSelectMobile__item}>СП7</button>
				<button disabled className={style.spSelectMobile__item}>СП8</button>
				<button disabled className={style.spSelectMobile__item}>СП9</button>
				<button className={style.spSelectMobile__item}>СП10</button>
				<button disabled className={style.spSelectMobile__item}>СП11</button>
				<button disabled className={style.spSelectMobile__item}>СП13</button>
			</div>
		</div>
	);
}

export default SpSelectMobile;
