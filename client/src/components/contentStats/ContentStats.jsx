import React, { useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import AmountComponent from "../amountComponent/AmountComponent";
import style from "./contentStats.module.scss";
import { observer } from "mobx-react-lite";
import { Context } from "../..";
import { useCountFormatter } from "../../hooks/useCountFormatter";
import { Link } from "react-router-dom";
import { PROFILE_ROUTE } from "../../utils/consts";
import { useDateFormatter } from "../../hooks/useDateFormatter";
import ContentStatsTitleSkeleton from "../Skeletons/ContentStatsTitleSkeleton";
import Skeleton from "../Skeletons/Skeleton";

const ContentStats = observer(({ dataUser, title, descr, descrLimit, onClick, likes, isLike, views, likeLoading, date, isNews, isLoading }) => {
	const { user } = useContext(Context);

	const [isExpanded, setIsExpanded] = useState(false)
	const [isHideContent, setIsHideContent] = useState(false);
	const [heightDescr, setHeightDescr] = useState(0);
	const [hideHeightDescr, setHideHeightDescr] = useState(0);

	const formatedLikes = useCountFormatter(likes);
	const formatedViews = useCountFormatter(views.length);
	const formatedDate = useMemo(() => useDateFormatter(date), [date]);

	const blockRef = useRef(null)
	console.log(descr);

	useEffect(() => {
		const blockElement = blockRef.current;
		console.log(descr)
		if (!blockElement) return;
		if (descr.length) {
			const height = blockElement.clientHeight;
			const hideHeight = blockElement.scrollHeight;
			setHeightDescr(height);
			setHideHeightDescr(hideHeight);
			console.log(height, hideHeight)

			if (height < hideHeight) {
				setIsHideContent(true);
			}
		}

	}, [descr, blockRef.current]);

	useEffect(() => {
		if (heightDescr !== 0 && hideHeightDescr !== 0) {
			if (isExpanded) {
				blockRef.current.style.height = hideHeightDescr + 'px'
			} else {
				blockRef.current.style.height = heightDescr + 'px'
			}
		}
	}, [isExpanded, heightDescr, hideHeightDescr])

	console.log(dataUser);
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

	return (
		<div className={style.block}>
			<div className={style.block__top}>
				{
					!isNews
					&&
					<h2 className={style.block__title}>{isLoading ? <Skeleton width={960} height={24} backgroundColor={"#222c36"} /> : title}</h2>
				}
				<div className={style.block__topContent}>


					{
						isLoading
							?
							<Skeleton width={150} height={42} backgroundColor={"#222c36"} />
							:
							(dataUser.roleId === 4 && isNews)
								?
								<div className={style.block__topUser}>
									<div className={style.block__topUserAvatar}>
										<svg width="70" height="70" viewBox="0 0 70 70" fill="none" xmlns="http://www.w3.org/2000/svg">
											<path d="M24.5 17.9747C27.5518 16.0885 31.1488 15 35 15C46.0457 15 55 23.9543 55 35C55 46.0457 46.0457 55 35 55C27.2998 55 20.616 50.6484 17.2736 44.2703L15.0829 50.1122C19.6488 56.1206 26.8713 60 35 60C48.8071 60 60 48.8071 60 35C60 21.1929 48.8071 10 35 10C31.2498 10 27.6925 10.8257 24.5 12.3053V17.9747Z" fill="#97BCE6" />
											<path d="M49.2268 61.4187C44.9933 63.7033 40.1481 65 35 65C18.4315 65 5 51.5685 5 35C5 18.4315 18.4315 5 35 5C51.5685 5 65 18.4315 65 35C65 36.1839 64.9314 37.3519 64.798 38.5H69.8272C69.9415 37.3488 70 36.1812 70 35C70 15.67 54.33 0 35 0C15.67 0 0 15.67 0 35C0 54.33 15.67 70 35 70C41.439 70 47.4719 68.2612 52.6548 65.2275L49.2268 61.4187Z" fill="#97BCE6" />
										</svg>
									</div>
									<div className={style.block__topUserText}>
										<span className={style.block__topUserName}>
											26Studio
										</span>
									</div>
								</div>
								:
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
					}


					<div className={style.block__right}>
						<AmountComponent
							img={like}
							value={formatedLikes}
							onClick={onClick}
							likeLoading={likeLoading}
							isLoading={isLoading}
						/>
						<AmountComponent img={view} value={formatedViews} isLoading={isLoading} />
						<AmountComponent img={calendar} value={formatedDate} isLoading={isLoading} />
					</div>
				</div>
			</div>
			{
				descr
				&&
				<div className={style.block__descr}>

					<p className={isExpanded || (!isExpanded && !isHideContent) ? style.block__descr__item : style.block__descr__item + " " + style.block__descr__item_expand} ref={blockRef} >
						{descr}
					</p>

					{
						isHideContent
							?
							<span className={style.block__descrButton} onClick={() => setIsExpanded(prev => !prev)}>
								{isExpanded ? 'Свернуть' : 'Развернуть'}
							</span>
							: null
					}
				</div>
			}


		</div>
	);
}
);

export default ContentStats;
