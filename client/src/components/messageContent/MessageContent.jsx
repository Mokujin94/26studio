import { useEffect, useRef, useState } from 'react';
import style from './messageContent.module.scss'
import useTimeFormatter from '../../hooks/useTimeFormatter';
import { CSSTransition } from 'react-transition-group';
import { useClickOutside } from '../../hooks/useClickOutside';
import Linkify from 'react-linkify';
import LinkPreview from '../linkPreview/linkPreview';

const MessageContent = ({ contextMenu, onContextMenu, isScrollBottom, windowChatRef, content, isOther, onVisible, isRead, load }) => {
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

	const renderLinkPreview = (text) => {
		const urlRegex = /((https?:\/\/)?[^\s.]+\.[^\s]{2,}|localhost:\d{4,5}\/[^\s]*)/g;
		const urls = text.match(urlRegex);

		if (urls) {
			return (
				<>
					{urls.map((url, index) => {
						// Добавляем http:// если протокол не указан
						if (!url.startsWith('http://') && !url.startsWith('https://')) {
							url = 'http://' + url;
						}
						return <LinkPreview isOther={isOther} isScrollBottom={isScrollBottom} windowChatRef={windowChatRef} key={index} url={url} />;
					})}
				</>
			);
		}
	};

	return (
		// <div ref={subMenuRef} style={{ position: 'relative' }}>
                <div
                        onContextMenu={(e) => {
                                e.preventDefault();
                                onContextMenu(e, content);
                        }}
                        ref={messageRef}
                        id={`message-${content.id}`}
                        className={contextMenu.message.id === content.id ? style.messageContent__highlight_active + " " + style.messageContent__highlight : style.messageContent__highlight}
                >
                        <div className={isOther ? style.messageContent + " " + style.messageContent_other : style.messageContent}>
                                {content.files && content.files.length > 0 && (
                                        <div className={style.messageContent__images}>
                                                {content.files.map((src, idx) => (
                                                        <img key={idx} src={src} alt="" />
                                                ))}
                                        </div>
                                )}
                                {/* <p className={style.messageContent__text}>
                                </p> */}
				<Linkify>{content.text}</Linkify>
				{renderLinkPreview(content.text)}
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
					<div className={style.messageContent__info__visible}>
						<span className={style.messageContent__infoTime}>{time}</span>
						{
							!isOther &&
							(
								!load ?
									(
										<div className={isRead ? style.messageContent__infoView + " " + style.messageContent__infoView_active : style.messageContent__infoView}>
											<svg xmlns="http://www.w3.org/2000/svg" width="17" height="10" viewBox="0 0 17 10" fill="none">
												<path className={style.messageContent__infoViewSecond} d="M6.5 7L8 9L16 1" stroke="#27323E" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" />
												<path d="M1 5.5L4 9C7.70998 5.09476 7.79002 4.90524 11.5 1" stroke="#27323E" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" />
											</svg>
										</div>
									) : load && (
										<div className={style.messageContent__infoLoad}>
											<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 22 22" fill="none">
												<path className={style.messageContent__infoLoadItem} d="M11 3.5V11" stroke="#1C274C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
												<path className={style.messageContent__infoLoadItem} d="M11 11H16" stroke="#1C274C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
												<path d="M6 2.33782C7.47087 1.48697 9.1786 1 11 1C16.5228 1 21 5.47715 21 11C21 16.5228 16.5228 21 11 21C5.47715 21 1 16.5228 1 11C1 9.1786 1.48697 7.47087 2.33782 6" stroke="#1C274C" strokeWidth="2" strokeLinecap="round" />
											</svg>
										</div>
									)
							)
						}
					</div>
				</div>
			</div>
		</div>
	);
};

export default MessageContent;
