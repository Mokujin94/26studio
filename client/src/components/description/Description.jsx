import React from "react";

import style from "./description.module.scss";

function Description(props) {
	return (
		<div className={style.block}>
			<div className={style.block__title}>{props.title}</div>
			<div className={style.block__descr}>{props.descr.map(item => {
				return (
					<p className={style.block__descr__item} key={item}>{item}</p>
				)
			})}</div>
		</div>
	);
}

export default Description;
