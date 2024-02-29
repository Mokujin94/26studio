import React, { useContext, useEffect, useRef, useState } from "react";
import likeIcon from "../../resource/graphics/icons/newsCard/likes.svg";
import viewIcon from "../../resource/graphics/icons/newsCard/views.svg";
import commentIcon from "../../resource/graphics/icons/newsCard/comments.svg";

import style from "./projectCard.module.scss";
import { useDateFormatter } from "../../hooks/useDateFormatter";
import { useCountFormatter } from "../../hooks/useCountFormatter";
import { observer } from "mobx-react-lite";
import { Context } from "../..";
import { useLocation } from "react-router-dom";
import { CSSTransition } from "react-transition-group";
import { deleteProjectById } from "../../http/projectAPI";

const ProjectCard = observer(({ id, img, title, name, date, like, view, comment, dataProjects, setDataProjects }) => {
	const { profile } = useContext(Context)
	const formatedDate = useDateFormatter(date);
	const formatedLikes = useCountFormatter(like);
	const formatedViews = useCountFormatter(view);
	const formatedComments = useCountFormatter(comment);
	const [acceptDelete, setAcceptDelete] = useState(false)

	useEffect(() => {
		setAcceptDelete(false)
	}, [profile.isOnSetting])

	useEffect(() => {
		profile.setIsOnSetting(false)
	}, [])

	const onTrash = (e) => {
		e.preventDefault()
		setAcceptDelete(true)
	}

	const onDelete = () => {
		deleteProjectById(id)
			.then(e => {
				const newDataProjects = dataProjects.filter((item) => item.id != id)
				setDataProjects(newDataProjects)
			})
			.catch(e => console.log(e, 'Ошибка при попытке удаления'))
	}

	return (
		<>
			{
				profile.isOnSetting &&
				<CSSTransition in={acceptDelete} timeout={300} classNames="create-anim" unmountOnExit>
					<div className={style.project__acceptDelete} onClick={(e) => e.preventDefault()}>
						<p className={style.project__acceptDeleteText}>
							Вы действительно хотите удалить проект?
						</p>
						<div className={style.project__acceptDeleteButtons}>
							<span className={style.project__acceptDeleteButtonsItem} onClick={onDelete}>Да</span>
							<span className={style.project__acceptDeleteButtonsItem} onClick={() => setAcceptDelete(false)}>Нет</span>
						</div>
					</div>
				</CSSTransition>
			}
			<CSSTransition in={profile.isOnSetting} timeout={300} classNames="create-anim" unmountOnExit>
				<div className={style.project__trash} onClick={onTrash}>
					<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
						<g id="SVGRepo_bgCarrier" stroke-width="0"></g>
						<g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g>
						<g id="SVGRepo_iconCarrier">
							<path
								d="M10 12L14 16M14 12L10 16M18 
									6L17.1991 18.0129C17.129 19.065
									17.0939 19.5911 16.8667 19.99C16.6666
									20.3412 16.3648 20.6235 16.0011 20.7998C15.588
									21 15.0607 21 14.0062 21H9.99377C8.93927 21 8.41202
									21 7.99889 20.7998C7.63517 20.6235 7.33339 20.3412
									7.13332 19.99C6.90607 19.5911 6.871 19.065 6.80086
									18.0129L6 6M4 6H20M16 6L15.7294 5.18807C15.4671
									4.40125 15.3359 4.00784 15.0927 3.71698C14.8779
									3.46013 14.6021 3.26132 14.2905 3.13878C13.9376
									3 13.523 3 12.6936 3H11.3064C10.477 3 10.0624
									3 9.70951 3.13878C9.39792 3.26132 9.12208 3.46013 8.90729
									3.71698C8.66405 4.00784 8.53292 4.40125 8.27064 5.18807L8 6"
								stroke="#000000"
								stroke-width="2"
								stroke-linecap="round"
								stroke-linejoin="round">
							</path>
						</g>
					</svg>
				</div>
			</CSSTransition>
			<div className={profile.isOnSetting ? style.project + " " + style.project_onSetting : style.project}>

				<div className={profile.isOnSetting ? style.project__blur + " " + style.project__blur_onSetting : style.project__blur}></div>
				<img
					src={process.env.REACT_APP_API_URL + '/' + img}
					className={style.project__photo}
					alt=""
				/>
				<div className={style.project__text}>
					<h2 className={style.project__text__title}>{title}</h2>
					<h2 className={style.project__text__name}>{name}</h2>
				</div>
				<div className={style.project__bottom_info}>
					<div className={style.project__date}>{formatedDate}</div>
					<div className={style.project__stats}>
						<div className={style.project__stats_item}>
							<img src={likeIcon} alt="" />
							<div className={style.project__stats_item_value}>
								{formatedLikes}
							</div>
						</div>
						<div className={style.project__stats_item}>
							<img src={viewIcon} alt="" />
							<div className={style.project__stats_item_value}>
								{formatedViews}
							</div>
						</div>
						<div className={style.project__stats_item}>
							<img src={commentIcon} alt="" />
							<div className={style.project__stats_item_value}>
								{formatedComments}
							</div>
						</div>
					</div>
				</div>
			</div>
		</>

	);
})

export default ProjectCard;
