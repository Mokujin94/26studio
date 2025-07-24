import React, { useState } from "react";
import style from "./projectFilter.module.scss";

function ProjectFilter({ selectedItem, setSelectedItem }) {
	const filterItems = [
		{ id: 0, title: "По лайкам", },
		{ id: 1, title: "По просмотрам", },
		{ id: 2, title: "По дате", },
	];

	const filterItem = filterItems.map(({ id, title }) => {
		return (
			<option
				value={id}
				className={style.filter__item}
				key={id}
			>
				{title}
			</option>
		);
	});

	return (
		<div className={style.block}>
			<select
				onChange={(e) => setSelectedItem(e.target.value)}
				className={style.filter}
				value={selectedItem}
			>
				<option value="" className={style.filter__item} disabled>
					Сортировка
				</option>
				{filterItem}
			</select>
			<svg
				className={style.block__arrow}
				width="11"
				height="22"
				viewBox="0 0 11 22"
				fill="none"
				xmlns="http://www.w3.org/2000/svg"
			>
				<path
					d="M1 21L9.2677 12.7677C10.2441 11.7955 10.2441 10.2045 9.2677 9.23232L1 1"
					stroke="#72FFF7"
					strokeWidth="1.5"
					strokeMiterlimit="10"
					strokeLinecap="round"
					strokeLinejoin="round"
				/>
			</svg>
		</div>
	);
}

export default ProjectFilter;
