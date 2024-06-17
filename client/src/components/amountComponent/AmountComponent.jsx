import React, { useState } from "react";

import style from "./amountComponent.module.scss";
import Skeleton from "../Skeletons/Skeleton";

function AmountComponent({ img, value, onClick, likeLoading, isLoading }) {
	return (
		<>
			{
				isLoading
					?
					<Skeleton width={100} height={37} backgroundColor={"#222c36"} />
					:
					<button disabled={likeLoading} className={onClick ? style.block : style.block + " " + style.block_noClicked} onClick={onClick}>
						{img(style)}
						<div className={style.block__amount} style={{ minWidth: value.length <= 4 && value.length * 11 }}>{value}</div>
					</button>
			}
		</>
	);
}

export default AmountComponent;
