import { useEffect, useRef, useState } from 'react';
import style from './messageContent.module.scss'
import useTimeFormatter from '../../hooks/useTimeFormatter';

const MessageContent = ({ content, isOther, onVisible, isRead }) => {
	const messageRef = useRef(null);

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
	// const [isRead, setIsRead] = useState(false)
	const time = useTimeFormatter(content.createdAt)
	return (
		<div ref={messageRef} className={isOther ? style.messageContent + " " + style.messageContent_other : style.messageContent}>
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
	);
};

export default MessageContent;