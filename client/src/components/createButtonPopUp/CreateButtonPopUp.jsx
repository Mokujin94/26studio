import React, { useContext, useState } from 'react';
import style from './createButtonPopUp.module.scss';
import './createAnim.scss';

import addProject from '../../resource/graphics/icons/createButtonPopUp/addProject.svg';
import addNews from '../../resource/graphics/icons/createButtonPopUp/addNews.svg';
import { CSSTransition } from 'react-transition-group';
import { Context } from '../..';
import { Link } from 'react-router-dom';
import { NEWS_CREATE_ROUTE } from '../../utils/consts';

function CreateButtonPopUp({ createPopupRef, setActiveCreatePopup, activeCreatePopup }) {


	const { user } = useContext(Context);

	return (
		<div
			onClick={() => setActiveCreatePopup((item) => !item)}
			ref={createPopupRef}
			className={activeCreatePopup ? `${style.button} ${style.button_active}` : style.button}
		>
			<svg
				className={style.button__cross}
				xmlns="http://www.w3.org/2000/svg"
				width="22"
				height="22"
				viewBox="0 0 22 22"
			>
				<path d="M1 11.0901H21Z" fill="#27323E" />
				<path d="M1 11.0901H21" stroke="#FCFCFC" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
				<path d="M11 21L11 1Z" fill="#27323E" />
				<path d="M11 21L11 1" stroke="#FCFCFC" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
			</svg>
			<CSSTransition
				in={activeCreatePopup}
				timeout={300}
				classNames="create-anim"
				mountOnEnter
				unmountOnExit
			>
				<div
					className={activeCreatePopup ? `${style.button__content} ${style.button__content_active}` : style.button__content}
					onClick={(e) => e.stopPropagation()}
				>
					<div
						className={style.button__contentItem}
						onClick={() => {
							user.setModalProject(true);
							setActiveCreatePopup((item) => !item);
						}}
					>
						<img className={style.button__contentItemImg} src={addProject} alt="" />
						Добавить проект
					</div>
					<Link to={NEWS_CREATE_ROUTE} className={style.button__contentItem}>
						<img className={style.button__contentItemImg} src={addNews} alt="" />
						Предложить новость
					</Link>
				</div>
			</CSSTransition>
		</div>
	);
}

export default CreateButtonPopUp;
