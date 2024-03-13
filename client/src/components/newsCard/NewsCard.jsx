import React from "react";

import { Link } from "react-router-dom";
import { NEWSPAPER_ROUTE } from "../../utils/consts";

import style from "./newsCard.module.scss";

import likesIcon from "../../resource/graphics/icons/newsCard/likes.svg";
import viewsIcon from "../../resource/graphics/icons/newsCard/views.svg";
import commentsIcon from "../../resource/graphics/icons/newsCard/comments.svg";

function NewsCard({ news }) {
	console.log(news);
	return (
		<div className={news.user.roleId === 3 ? style.card + ' ' + style.card_special : style.card}>
			<div className={style.preview}>
				<img
					src={process.env.REACT_APP_API_URL + news.img}
					alt="img"
					className={style.preview__img}
				/>
			</div>
			<div className={style.info}>
				<h2 className={style.title}>{news.title}</h2>
				<p className={style.description}>{news.description}</p>
			</div>
			<div className={style.stats}>
				<div className={style.stats__item}>
					<img src={likesIcon} alt="icon" />
					<div className={style.stats__count}>{news.likes.length}</div>
				</div>
				<div className={style.stats__item}>
					<img src={commentsIcon} alt="icon" />
					<div className={style.stats__count}>{news.comments.length}</div>
				</div>
				<div className={style.stats__item}>
					<img src={viewsIcon} alt="icon" />
					<div className={style.stats__count}>{news.views.length}</div>
				</div>
			</div>
		</div>
	);
}

export default NewsCard;
