import style from './chat.module.scss'

const Chat = () => {
	return (
		<div className={style.chat}>
			<div className={style.chat__avatar}>
				<img src={process.env.REACT_APP_API_URL + "/" + 'avatar.jpg'} alt="" />
			</div>
			<div className={style.chat__text}>
				<span className={style.chat__textName}>
					Имя
				</span>
				<p className={style.chat__textMessage}>Сообщение...</p>
			</div>
			<div className={style.chat__info}>
				<span className={style.chat__infoTime}>15:43</span>
				<div className={style.chat__infoCount}>
					<span className={style.chat__infoCountText}>1</span>
				</div>
			</div>
		</div>
	);
};

export default Chat;