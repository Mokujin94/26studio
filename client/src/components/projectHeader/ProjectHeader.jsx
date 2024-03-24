import React, { useCallback, useContext, useEffect, useMemo, useState } from "react";
import AmountComponent from "../amountComponent/AmountComponent";

import style from "./projectHeader.module.scss";
import { observer } from "mobx-react-lite";
import { Context } from "../..";
import { useCountFormatter } from "../../hooks/useCountFormatter";
import { Link } from "react-router-dom";
import { PROFILE_ROUTE } from "../../utils/consts";
import { useDateFormatter } from "../../hooks/useDateFormatter";

const ProjectHeader = observer(({ dataUser, title, descr, descrLimit, onClick, likes, isLike, views, likeLoading, date }) => {
	const { user } = useContext(Context);

	const [totalCharacters, setTotalCharacters] = useState(0);
	const [isExpanded, setIsExpanded] = useState(false)

	const formatedLikes = useCountFormatter(likes);
	const formatedViews = useCountFormatter(views.length);
	const formatedDate = useMemo(() => useDateFormatter(date), [date]);


	const like = (style) => {
		return (
			<svg
				className={
					isLike
						? style.block__img + " " + style.block__img__active
						: style.block__img
				}
				width="22"
				height="22"
				viewBox="0 0 22 22"
				fill="none"
				xmlns="http://www.w3.org/2000/svg"
			>
				<path
					d="M5.5 0C3.9875 0 2.64 0.741935 1.6225 1.90323C0.6325 3.06452 0 4.64516 0 6.45161C0 8.22581 0.6325 9.80645 1.6225 11L11 22L20.3775 11C21.3675 9.83871 22 8.25806 22 6.45161C22 4.67742 21.3675 3.09677 20.3775 1.90323C19.3875 0.741935 18.04 0 16.5 0C14.9875 0 13.64 0.741935 12.6225 1.90323C11.6325 3.06452 11 4.64516 11 6.45161C11 4.67742 10.3675 3.09677 9.3775 1.90323C8.3875 0.741935 7.04 0 5.5 0Z"
					fill="white"
				/>
			</svg>
		);
	};

	const view = (style) => {
		return (
			<svg
				className={style.block__img}
				width="22"
				height="15"
				viewBox="0 0 22 15"
				fill="none"
				xmlns="http://www.w3.org/2000/svg"
			>
				<path
					d="M11.0825 0C4.125 0 0 7.5 0 7.5C0 7.5 4.125 15 11.0825 15C17.875 15 22 7.5 22 7.5C22 7.5 17.875 0 11.0825 0ZM11 2.5C14.0525 2.5 16.5 4.75 16.5 7.5C16.5 10.275 14.0525 12.5 11 12.5C7.975 12.5 5.5 10.275 5.5 7.5C5.5 4.75 7.975 2.5 11 2.5ZM11 5C9.4875 5 8.25 6.125 8.25 7.5C8.25 8.875 9.4875 10 11 10C12.5125 10 13.75 8.875 13.75 7.5C13.75 7.25 13.64 7.025 13.585 6.8C13.365 7.2 12.925 7.5 12.375 7.5C11.605 7.5 11 6.95 11 6.25C11 5.75 11.33 5.35 11.77 5.15C11.5225 5.075 11.275 5 11 5Z"
					fill="white"
				/>
			</svg>
		);
	};

	const calendar = (style) => {
		return (
			<svg className={style.block__img} fill="#ffffff" viewBox="0 0 24.00 24.00" id="Outline" xmlns="http://www.w3.org/2000/svg" stroke="#ffffff" strokeWidth="0.00024000000000000003">
				<g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
				<g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
				<g id="SVGRepo_iconCarrier">
					<path d="M12,6a1,1,0,0,0-1,1v5a1,1,0,0,0,.293.707l3,3a1,1,0,0,0,1.414-1.414L13,11.586V7A1,1,0,0,0,12,6Z M23.812,10.132A12,12,0,0,0,3.578,3.415V1a1,1,0,0,0-2,0V5a2,2,0,0,0,2,2h4a1,1,0,0,0,0-2H4.827a9.99,9.99,0,1,1-2.835,7.878A.982.982,0,0,0,1,12a1.007,1.007,0,0,0-1,1.1,12,12,0,1,0,23.808-2.969Z"></path>
				</g>
			</svg>
		);
	};

	useEffect(() => {
		calculateTotalCharacters();
	}, [descr]);

	const calculateTotalCharacters = useCallback(() => {
		let total = 0;
		// if (Array.isArray(descr))
		descr.forEach(word => {
			total += word.length;
		});
		setTotalCharacters(total);
		console.log(descr);
		console.log(total);
	}, [descr]);

	return (
		<div className={style.block}>
			<div className={style.block__top}>
				<h2 className={style.block__title}>{title}</h2>
				<div className={style.block__topContent}>
					<Link to={PROFILE_ROUTE + "/" + dataUser.id} className={style.block__topUser}>
						<div className={style.block__topUserAvatar}>
							<img src={process.env.REACT_APP_API_URL + "/" + dataUser.avatar} alt="" />
						</div>
						<div className={style.block__topUserText}>
							<span className={style.block__topUserName}>
								{dataUser.name}
							</span>
						</div>
					</Link>
					<div className={style.block__right}>
						<AmountComponent
							img={like}
							value={formatedLikes}
							onClick={onClick}
							likeLoading={likeLoading}
						/>
						<AmountComponent img={view} value={formatedViews} />
						<AmountComponent img={calendar} value={formatedDate} />
					</div>
				</div>
			</div>
			<div className={style.block__descr}>
				{
					descrLimit.length && !isExpanded
						? descrLimit.map((item, i) => {
							if (i > 2 && !isExpanded) return
							return (
								<p className={style.block__descr__item} key={i}>{item}</p>
							)
						})
						: descr.map((item, i) => {
							if (i > 2 && !isExpanded) return
							return (
								<p className={style.block__descr__item} key={i}>{item}</p>
							)
						})
				}
				{
					descr.length > 3 || totalCharacters > 300
						? <div className={isExpanded ? style.block__descrButton + " " + style.block__descrButton_active : style.block__descrButton}>
							{/* <div className={ isExpanded ? style.block__descrButtonIcon + " " + style.block__descrButtonIcon_active : style.block__descrButtonIcon}>
										
									</div> */}
							<span className={style.block__descrButtonText} onClick={() => setIsExpanded(prev => !prev)}>
								{isExpanded ? 'Свернуть' : 'Развернуть'}
							</span>
						</div>
						: null
				}
			</div>

		</div>
	);
}
);

export default ProjectHeader;
