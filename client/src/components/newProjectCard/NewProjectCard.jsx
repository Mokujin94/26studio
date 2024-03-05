import { CSSTransition, SwitchTransition } from 'react-transition-group';
import { useCountFormatter } from '../../hooks/useCountFormatter';
import { useDateFormatter } from '../../hooks/useDateFormatter';
import style from './newProjectCard.module.scss'
import { useRef, useState } from 'react';
import ProjectViewer from '../ProjectViewer/ProjectViewer';
import { useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import { useContext } from 'react';
import { Context } from '../..';
import { deleteProjectById } from '../../http/projectAPI';

const NewProjectCard = observer(({ id, img, title, name, date, like, view, comment, user, baseURL, pathFromProject, dataProjects, setDataProjects }) => {

	const { profile } = useContext(Context)
	const projectRef = useRef(null);

	const [viewState, setViewState] = useState(false)
	const [acceptDelete, setAcceptDelete] = useState(false)

	useEffect(() => {
		setAcceptDelete(false)
	}, [profile.isOnSetting])

	useEffect(() => {
		profile.setIsOnSetting(false)
	}, [])

	const formatedDate = useDateFormatter(date);
	const formatedLikes = useCountFormatter(like);
	const formatedComments = useCountFormatter(comment);
	const formatedViews = useCountFormatter(view);

	const styles = {
		width: `calc((1 / (${projectRef.current && projectRef.current.offsetHeight} / 960)) * 100%)`,
		height: `calc((1 / (${projectRef.current && projectRef.current.offsetHeight} / 960)) * 100%)`,
		position: 'absolute',
		transform: `scale(calc(${projectRef.current && projectRef.current.offsetHeight} / 960))`,
		MozTransformStyle: `scale(calc(${projectRef.current && projectRef.current.offsetHeight} / 960))`,
		OTransform: `scale(calc(${projectRef.current && projectRef.current.offsetHeight} / 960))`,
		WebkitTransform: `scale(calc(${projectRef.current && projectRef.current.offsetHeight} / 960))`,
	}

	const styleWrap = {
		height: '100%'
	}

	const onHovering = () => {
		setViewState(true)
	}

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
					<div className={style.newProjectCard__acceptDelete} onClick={(e) => e.preventDefault()}>
						<p className={style.newProjectCard__acceptDeleteText}>
							Вы действительно хотите удалить проект?
						</p>
						<div className={style.newProjectCard__acceptDeleteButtons}>
							<span className={style.newProjectCard__acceptDeleteButtonsItem} onClick={onDelete}>Да</span>
							<span className={style.newProjectCard__acceptDeleteButtonsItem} onClick={() => setAcceptDelete(false)}>Нет</span>
						</div>
					</div>
				</CSSTransition>
			}
			<CSSTransition in={profile.isOnSetting} timeout={300} classNames="create-anim" unmountOnExit>
				<div className={style.newProjectCard__trash} onClick={onTrash}>
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
			<div className={profile.isOnSetting ? style.newProjectCard + " " + style.newProjectCard__onSetting : style.newProjectCard} onMouseEnter={onHovering} onMouseLeave={() => setViewState(false)}>

				{/* <CSSTransition>
				<ProjectViewer
					pathFromProject={pathFromProject}
					baseURL={baseURL}
					styles={styles}
					styleWrap={styleWrap}
				/>
			</CSSTransition> */}
				<div ref={projectRef} className={style.newProjectCard__preview}>
					<div className={profile.isOnSetting ? style.newProjectCard__blur + " " + style.newProjectCard__blur_onSetting : style.newProjectCard__blur}></div>
					<SwitchTransition mode="out-in">
						<CSSTransition
							key={viewState}
							timeout={100}
							classNames='create-anim'
						>
							{viewState ?
								<div style={{ height: '100%', pointerEvents: 'none' }}>
									<ProjectViewer
										pathFromProject={pathFromProject}
										baseURL={baseURL}
										styles={styles}
										styleWrap={styleWrap}
									/>
								</div>
								:
								<img src={process.env.REACT_APP_API_URL + '/' + img} alt="preview_image" />
							}
						</CSSTransition>
					</SwitchTransition>
				</div>
				{/* <div className={style.newProjectCard__preview}>
				<img src={process.env.REACT_APP_API_URL + '/' + img} alt="preview_image" />
			</div> */}
				<div className={style.newProjectCard__info}>
					<div className={style.newProjectCard__content}>
						<div className={style.newProjectCard__content__img}>
							<img src={process.env.REACT_APP_API_URL + '/' + user.avatar} alt="" />
						</div>
						<div className={style.newProjectCard__content__about}>
							<h2 className={style.newProjectCard__content__about__title}>{title}</h2>
							<div className={style.newProjectCard__content__about__user}>
								<span className={style.newProjectCard__content__about__user__text}>{user.name}</span>
								<span className={style.newProjectCard__content__about__user__text}>{formatedDate}</span>
							</div>
						</div>
					</div>
					<div className={style.newProjectCard__activity}>
						<div className={style.newProjectCard__activity__item}>
							<div className={style.newProjectCard__activity__img}>
								<svg
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
							</div>
							<span className={style.newProjectCard__activity__count}>{formatedLikes}</span>
						</div>
						<div className={style.newProjectCard__activity__item}>
							<div className={style.newProjectCard__activity__img}>
								<svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
									<path d="M0.2475 0.0275C0.0825 0.0275 0 0.1375 0 0.275V16.2525C0 16.39 0.11 16.5 0.2475 16.5H16.5L22 22V0.2475C22 0.0825 21.89 0 21.7525 0H0.275L0.2475 0.0275Z" fill="white" />
								</svg>
							</div>
							<span className={style.newProjectCard__activity__count}>{formatedComments}</span>
						</div>
						<div className={style.newProjectCard__activity__item}>
							<div className={style.newProjectCard__activity__img}>
								<svg width="22" height="15" viewBox="0 0 22 15" fill="none" xmlns="http://www.w3.org/2000/svg">
									<path d="M11.0825 0C4.125 0 0 7.5 0 7.5C0 7.5 4.125 15 11.0825 15C17.875 15 22 7.5 22 7.5C22 7.5 17.875 0 11.0825 0ZM11 2.5C14.0525 2.5 16.5 4.75 16.5 7.5C16.5 10.275 14.0525 12.5 11 12.5C7.975 12.5 5.5 10.275 5.5 7.5C5.5 4.75 7.975 2.5 11 2.5ZM11 5C9.4875 5 8.25 6.125 8.25 7.5C8.25 8.875 9.4875 10 11 10C12.5125 10 13.75 8.875 13.75 7.5C13.75 7.25 13.64 7.025 13.585 6.8C13.365 7.2 12.925 7.5 12.375 7.5C11.605 7.5 11 6.95 11 6.25C11 5.75 11.33 5.35 11.77 5.15C11.5225 5.075 11.275 5 11 5Z" fill="white" />
								</svg>
							</div>
							<span className={style.newProjectCard__activity__count}>{formatedViews}</span>
						</div>
					</div>
				</div>
			</div>
		</>
	);
});

export default NewProjectCard;