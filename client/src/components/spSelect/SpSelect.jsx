import React from 'react';

import style from './spSelect.module.scss';

function SpSelect() {
	return (
		<div className={style.spSelect}>
			<div className={style.spSelect__title}>Структурные подразделения</div>
			<div className={style.spSelect__wrapper}>
				<button disabled className={style.spSelect__item}>СП1</button>
				<button disabled className={style.spSelect__item}>СП2</button>
				<button disabled className={style.spSelect__item}>СП3</button>
				<button disabled className={style.spSelect__item}>СП4</button>
				<button disabled className={style.spSelect__item}>СП5</button>
				<button disabled className={style.spSelect__item}>СП6</button>
				<button disabled className={style.spSelect__item}>СП7</button>
				<button disabled className={style.spSelect__item}>СП8</button>
				<button disabled className={style.spSelect__item}>СП9</button>
				<button className={style.spSelect__item}>СП10</button>
				<button disabled className={style.spSelect__item}>СП11</button>
				<button disabled className={style.spSelect__item}>СП12</button>
				<button disabled className={style.spSelect__item}>СП13</button>
			</div>
		</div>
	);
}

export default SpSelect;
