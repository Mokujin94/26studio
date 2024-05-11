import { useContext, useEffect, useState } from 'react';
import style from './chat.module.scss'
import { observer } from 'mobx-react-lite';
import { Context } from '../..';
import { Link, useLocation, useParams } from 'react-router-dom';
import { MESSENGER_ROUTE } from '../../utils/consts';
import useTimeFormatter from '../../hooks/useTimeFormatter';

const Chat = observer(({ chat }) => {
	const { user } = useContext(Context)
	const [otherUserData, setOtherUserData] = useState({})
	const [userData, setUserData] = useState({})
	const [lastMessage, setLastMessage] = useState({})

	const location = useLocation();
	const hashPersonal = Number(location.hash.replace("#", ""))
	const hashGroup = Number(location.hash.replace("#chatGroup=", ""))

	useEffect(() => {
		if (chat.messages.length) {
			setLastMessage(chat.messages[0])
		}
		chat.members.filter(item => {
			if (item.id !== user.user.id) {
				setOtherUserData(item)
			} else {
				setUserData(item)
			}
		})
	}, [])

	useEffect(() => {
		if (user.socket === null) return;
		user.socket.on("lastMessage", (message) => {
			if (message.chatId !== chat.id) return;
			setLastMessage(message);
		})
		return () => {
			user.socket.off("lastMessage")
		}
	}, [user.socket, chat])


	return (
		<>
			{
				chat.is_group
					?
					<Link className={chat.id === hashGroup ? style.chat + ' ' + style.chat_active : style.chat} to={MESSENGER_ROUTE + `/#chatGroup=${chat.id}`}>

						<div className={style.chat__avatar}>
							<img src={process.env.REACT_APP_API_URL + "/" + `${chat.members.length < 2 ? userData.avatar : otherUserData.avatar}`} alt="" />
						</div>
						<div className={style.chat__text}>
							<span className={style.chat__textName}>
								{chat.name}
							</span>
							<p className={style.chat__textMessage}>Сообщение...</p>
						</div>
						<div className={style.chat__info}>
							<span className={style.chat__infoTime}>15:43</span>
							<div className={style.chat__infoCount}>
								<span className={style.chat__infoCountText}>1</span>
							</div>
						</div>
					</Link>
					:
					<Link className={chat.members.length < 2 ? userData.id === hashPersonal ? style.chat + ' ' + style.chat_active : style.chat : otherUserData.id === hashPersonal ? style.chat + ' ' + style.chat_active : style.chat} to={MESSENGER_ROUTE + `/#${chat.members.length < 2 ? userData.id : otherUserData.id}`}>

						<div className={style.chat__avatar}>
							<img src={process.env.REACT_APP_API_URL + "/" + `${chat.members.length < 2 ? userData.avatar : otherUserData.avatar}`} alt="" />
						</div>
						<div className={style.chat__text}>
							<span className={style.chat__textName}>
								{chat.members.length < 2 ? "Избранное" : otherUserData.name}
							</span>
							<p className={style.chat__textMessage}>{lastMessage.text}</p>
						</div>
						<div className={style.chat__info}>
							{
								lastMessage.text && <span className={style.chat__infoTime}>{useTimeFormatter(lastMessage.createdAt)}</span>
							}

							{
								chat.notReadMessages.length > 0 &&
								<div className={style.chat__infoCount}>
									<span className={style.chat__infoCountText}>{chat.notReadMessages.length}</span>
								</div>
							}
						</div>
					</Link>
			}
		</>
	);
});

export default Chat;