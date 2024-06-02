import React, { useEffect, useRef, useState } from 'react';

import style from './messageContextMenu.module.scss'

const MessageContextMenu = ({ message, position, onClose, onReply, onCopy }) => {

	const menuRef = useRef(null);

	useEffect(() => {
		const handleMouseMove = (event) => {
			if (!menuRef.current) return;
			const rect = menuRef.current.getBoundingClientRect();
			const buffer = 100;
			const outside =
				event.clientX < rect.left - buffer ||
				event.clientX > rect.right + buffer ||
				event.clientY < rect.top - buffer ||
				event.clientY > rect.bottom + buffer;
			if (outside) {
				onClose();
			}
		};

		window.addEventListener('mousemove', handleMouseMove);
		return () => {
			window.removeEventListener('mousemove', handleMouseMove);
		};
	}, [onClose]);
	return (
		<div
			style={{
				top: position.y,
				left: position.x,
			}}
			onClick={(e) => e.stopPropagation()}
			className={style.messageContextMenu__subMenu}
			ref={menuRef}
		>
			<ul className={style.messageContextMenu__subMenuList}>
				<li className={style.messageContextMenu__subMenuListItem} onClick={() => onReply(message)}>
					<span className={style.messageContextMenu__subMenuListItemText}>
						Ответить
					</span>
					<div className={style.messageContextMenu__subMenuListItemIcon}>
						<svg viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg" fill="#000000" class="bi bi-reply-fill">
							<g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
							<g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
							<g id="SVGRepo_iconCarrier">
								<path d="M5.921 11.9 1.353 8.62a.719.719 0 0 1 0-1.238L5.921 4.1A.716.716 0 0 1 7 4.719V6c1.5 0 6 0 7 8-2.5-4.5-7-4-7-4v1.281c0 .56-.606.898-1.079.62z">
								</path>
							</g>
						</svg>
					</div>
				</li>
				<li className={style.messageContextMenu__subMenuListItem} onClick={() => onCopy(message.id)}>
					<span className={style.messageContextMenu__subMenuListItemText}>
						Копировать
					</span>
					<div className={style.messageContextMenu__subMenuListItemIcon}>
						<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M16 12.9V17.1C16 20.6 14.6 22 11.1 22H6.9C3.4 22 2 20.6 2 17.1V12.9C2 9.4 3.4 8 6.9 8H11.1C14.6 8 16 9.4 16 12.9Z" fill="#292D32"></path> <path d="M17.0998 2H12.8998C9.81668 2 8.37074 3.09409 8.06951 5.73901C8.00649 6.29235 8.46476 6.75 9.02167 6.75H11.0998C15.2998 6.75 17.2498 8.7 17.2498 12.9V14.9781C17.2498 15.535 17.7074 15.9933 18.2608 15.9303C20.9057 15.629 21.9998 14.1831 21.9998 11.1V6.9C21.9998 3.4 20.5998 2 17.0998 2Z" fill="#292D32"></path> </g></svg>
					</div>
				</li>
			</ul>
		</div>
	);
};

export default MessageContextMenu;
