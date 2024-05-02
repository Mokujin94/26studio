import { useContext, useEffect, useState } from 'react';
import style from './chat.module.scss'
import { observer } from 'mobx-react-lite';
import { Context } from '../..';
import { Link, useLocation, useParams } from 'react-router-dom';
import { MESSENGER_ROUTE } from '../../utils/consts';

const Chat = observer(({ chat }) => {
	const { user } = useContext(Context)
	const [otherUserData, setOtherUserData] = useState({})
	const [userData, setUserData] = useState({})

	const location = useLocation();
	const hashPersonal = Number(location.hash.replace("#", ""))
	const hashGroup = Number(location.hash.replace("#chatGroup=", ""))

	useEffect(() => {
		chat.members.filter(item => {
			if (item.id !== user.user.id) {
				setOtherUserData(item)
			} else {
				setUserData(item)
			}
		})
	}, [])

	console.log(chat);

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
							<p className={style.chat__textMessage}>{chat.messages.length ? chat.messages[0].text : 'избранное'}</p>
						</div>
						<div className={style.chat__info}>
							<span className={style.chat__infoTime}>15:43</span>
							<div className={style.chat__infoCount}>
								<span className={style.chat__infoCountText}>1</span>
							</div>
						</div>
					</Link>
			}
		</>
	);
});

export default Chat;