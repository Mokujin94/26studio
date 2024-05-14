import { useEffect, useRef, useState } from 'react';
import style from './messageContent.module.scss'
import useTimeFormatter from '../../hooks/useTimeFormatter';
import { CSSTransition } from 'react-transition-group';
import { useClickOutside } from '../../hooks/useClickOutside';

const MessageContent = ({ content, isOther, onVisible, isRead }) => {
    const messageRef = useRef(null);

    const [isSubMenu, setIsSubMenu] = useState(Boolean)

    const subMenuRef = useRef(null)

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    // 
                    onVisible(content.id); // Сообщение стало видимым, вызываем обработчик
                    observer.disconnect(); // Прекращаем наблюдение после первого срабатывания
                }
            },
            { threshold: 0.5 } // Процент видимости, при котором срабатывает событие
        );

        if (messageRef.current) {
            observer.observe(messageRef.current); // Начинаем наблюдать за элементом
        }
        return () => {
            observer.disconnect(); // Чистка при размонтировании компонента
        };
    }, [content]);

    const onSubMenu = (e) => {
        e.preventDefault()
        if (isSubMenu == true) {
            return
        }
        setIsSubMenu(prev => !prev)
    }

    useClickOutside(subMenuRef, () => {
        setIsSubMenu(false)
    })

    // const [isRead, setIsRead] = useState(false)
    const time = useTimeFormatter(content.createdAt)
    return (
        // <div ref={subMenuRef} style={{ position: 'relative' }}>
        <>
            <div ref={messageRef} className={isOther ? style.messageContent + " " + style.messageContent_other : style.messageContent} onContextMenu={onSubMenu}>
                <p className={style.messageContent__text}>{content.text}</p>
                <div className={style.messageContent__info}>
                    <span className={style.messageContent__infoTime}>{time}</span>
                    {
                        !isOther &&
                        <div className={isRead ? style.messageContent__infoView + " " + style.messageContent__infoView_active : style.messageContent__infoView}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="17" height="10" viewBox="0 0 17 10" fill="none">
                                <path className={style.messageContent__infoViewSecond} d="M6.5 7L8 9L16 1" stroke="#27323E" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" />
                                <path d="M1 5.5L4 9C7.70998 5.09476 7.79002 4.90524 11.5 1" stroke="#27323E" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </div>
                    }
                </div>
            </div>
            {/* <CSSTransition
				in={isSubMenu}
				timeout={300}
				classNames="create-anim"
				unmountOnExit
			>
				<div className={style.messageContent__subMenu}  >
					<ul className={style.messageContent__subMenuList}>
						<li className={style.messageContent__subMenuListItem}>
							<span className={style.messageContent__subMenuListItemText}>
								Ответить
							</span>
							<div className={style.messageContent__subMenuListItemIcon}>
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
					</ul>
				</div>
			</CSSTransition> */}
        </>
        // </div >
    );
};

export default MessageContent;