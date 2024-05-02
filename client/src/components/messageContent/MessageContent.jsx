import { useState } from 'react';
import style from './messageContent.module.scss'

const MessageContent = ({ content, isOther }) => {
	const [isRead, setIsRead] = useState(false)
	return (
		<div className={isOther ? style.messageContent + " " + style.messageContent_other : style.messageContent}>
			<p className={style.messageContent__text}>{content}</p>
			<div className={style.messageContent__info}>
				<span className={style.messageContent__infoTime}>15:44</span>
				{
					!isOther &&
					<div className={isRead ? style.messageContent__infoView + " " + style.messageContent__infoView_active : style.messageContent__infoView} onClick={() => setIsRead(prev => !prev)}>
						<svg xmlns="http://www.w3.org/2000/svg" width="17" height="10" viewBox="0 0 17 10" fill="none">
							<path className={style.messageContent__infoViewSecond} d="M6.5 7L8 9L16 1" stroke="#27323E" stroke-width="1.25" stroke-linecap="round" stroke-linejoin="round" />
							<path d="M1 5.5L4 9C7.70998 5.09476 7.79002 4.90524 11.5 1" stroke="#27323E" stroke-width="1.25" stroke-linecap="round" stroke-linejoin="round" />
						</svg>
					</div>
				}
			</div>
		</div>
	);
};

export default MessageContent;