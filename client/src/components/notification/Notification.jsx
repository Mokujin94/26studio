import React, { useContext, useEffect, useState } from "react";

import style from "./notification.module.scss";

import { CSSTransition } from "react-transition-group";
import { Context } from "../..";
import NotificationsModal from "../notificationsModal/NotificationsModal";
import { observer } from "mobx-react-lite";
import { fetchNotifications } from "../../http/notificationAPI";

const Notification = observer(({ notificationsRef, setActiveNotifications, activeNotifications }) => {
	const { user } = useContext(Context)
	const [isViewNotifications, setIsViewNotifications] = useState(false)


	useEffect(() => {
		user.notifications.filter(item => {
			if (!item.status) return setIsViewNotifications(true)
		})
	}, [user.notifications])


	return (
		<div
			className={activeNotifications ? style.notification + " " + style.notification_active : style.notification}
			onClick={() => { setActiveNotifications(item => !item); setIsViewNotifications(false) }}
			ref={notificationsRef}
		>
			<svg
				className={isViewNotifications ? style.notification__icon + " " + style.notification__icon_active : style.notification__icon}
				viewBox="0 0 24 24"
				fill="none"
				xmlns="http://www.w3.org/2000/svg"
			>
				<path
					fillRule="evenodd"
					clipRule="evenodd"
					d="M6.31317 12.463C6.20006 9.29213 8.60976 6.6252 11.701 6.5C14.7923 6.6252 17.202 9.29213 17.0889 12.463C17.0889 13.78 18.4841 15.063 18.525 16.383C18.525 16.4017 18.525 16.4203 18.525 16.439C18.5552 17.2847 17.9124 17.9959 17.0879 18.029H13.9757C13.9786 18.677 13.7404 19.3018 13.3098 19.776C12.8957 20.2372 12.3123 20.4996 11.701 20.4996C11.0897 20.4996 10.5064 20.2372 10.0923 19.776C9.66161 19.3018 9.42346 18.677 9.42635 18.029H6.31317C5.48869 17.9959 4.84583 17.2847 4.87602 16.439C4.87602 16.4203 4.87602 16.4017 4.87602 16.383C4.91795 15.067 6.31317 13.781 6.31317 12.463Z"
					stroke="#000000"
					strokeWidth="1.5"
					strokeLinecap="round"
					strokeLinejoin="round"
				/>
				<path
					d="M9.42633 17.279C9.01212 17.279 8.67633 17.6148 8.67633 18.029C8.67633 18.4432 9.01212 18.779 9.42633 18.779V17.279ZM13.9757 18.779C14.3899 18.779 14.7257 18.4432 14.7257 18.029C14.7257 17.6148 14.3899 17.279 13.9757 17.279V18.779ZM12.676 5.25C13.0902 5.25 13.426 4.91421 13.426 4.5C13.426 4.08579 13.0902 3.75 12.676 3.75V5.25ZM10.726 3.75C10.3118 3.75 9.97601 4.08579 9.97601 4.5C9.97601 4.91421 10.3118 5.25 10.726 5.25V3.75ZM9.42633 18.779H13.9757V17.279H9.42633V18.779ZM12.676 3.75H10.726V5.25H12.676V3.75Z"
					fill="#000000"
				/>
			</svg>
			<CSSTransition
				in={activeNotifications}
				timeout={300}
				classNames="create-anim"
				mountOnEnter
				unmountOnExit
			>
				<NotificationsModal />
			</CSSTransition>
			<CSSTransition
				in={isViewNotifications}
				timeout={300}
				classNames="create-anim"
				mountOnEnter
				unmountOnExit
			>
				<div className={style.notification__circle}></div>
			</CSSTransition>
		</div>
	);
})

export default Notification;
