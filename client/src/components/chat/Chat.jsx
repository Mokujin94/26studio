import { useContext, useEffect, useState } from 'react';
import style from './chat.module.scss'
import { fetchChat } from '../../http/chatsAPI';
import { observer } from 'mobx-react-lite';
import { Context } from '../..';
import { Link, useParams } from 'react-router-dom';
import { MESSENGER_ROUTE } from '../../utils/consts';

const Chat = observer(({ chatId }) => {
	const { user } = useContext(Context)
	const [chatData, setChatData] = useState({});
	const { id } = useParams();

	useEffect(() => {
		fetchChat(chatId)
			.then((data) => {
				setChatData(data)
			})
			.catch(e => console.log(e))
	}, [chatId])

	return (
		<Link className={id == chatId ? style.chat + " " + style.chat_active : style.chat} to={MESSENGER_ROUTE + "/" + chatId}>
			{
				chatData.users
				&&
				(user.user.id === chatId
					?
					<>
						<div className={style.chat__avatar}>
							<img src={process.env.REACT_APP_API_URL + "/" + chatData.users[0].avatar} alt="" />
						</div>
						<div className={style.chat__text}>
							<span className={style.chat__textName}>
								Избранное
							</span>
							<p className={style.chat__textMessage}>Добавьте заметку</p>
						</div>
						<div className={style.chat__info}>
							<span className={style.chat__infoTime}>15:43</span>
							<div className={style.chat__infoCount}>
								<span className={style.chat__infoCountText}>1</span>
							</div>
						</div>
					</>
					:
					<>
						<div className={style.chat__avatar}>
							<img src={process.env.REACT_APP_API_URL + "/" + chatData.users[0].avatar} alt="" />
						</div>
						<div className={style.chat__text}>
							<span className={style.chat__textName}>
								{chatData.users[0].name}
							</span>
							<p className={style.chat__textMessage}>Сообщение...</p>
						</div>
						<div className={style.chat__info}>
							<span className={style.chat__infoTime}>15:43</span>
							<div className={style.chat__infoCount}>
								<span className={style.chat__infoCountText}>1</span>
							</div>
						</div>
					</>)
			}
		</Link>
	);
});

export default Chat;