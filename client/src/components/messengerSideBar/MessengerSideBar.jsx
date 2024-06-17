import { useContext } from 'react';
import Chat from '../chat/Chat';
import style from './messengerSideBar.module.scss'
import { Context } from '../..';
import { observer } from 'mobx-react-lite';
import { CSSTransition, TransitionGroup } from 'react-transition-group';

const MessengerSideBar = observer(({ chats, setChats, hash }) => {
	const { user } = useContext(Context);

	const renderChats = chats.map(chat => {
		return (
			<CSSTransition
				key={chat.id}
				// in={chats.length}
				timeout={300}
				classNames="create-anim"
			>
				<Chat chat={chat} hash={hash} />
			</CSSTransition>
		)
	})
	return (
		<div className={style.sideBar}>
			<div className={style.sideBar__header}>
				<div className={style.sideBar__search}>
					<input className={style.sideBar__searchInput} placeholder='Поиск по чатам' />
					<div className={style.sideBar__searchIcon}>
						<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 12 12" fill="none">
							<path d="M11 11L10 10M5.75 10.5C6.37378 10.5 6.99145 10.3771 7.56775 10.1384C8.14404 9.89972 8.66768 9.54984 9.10876 9.10876C9.54984 8.66768 9.89972 8.14404 10.1384 7.56775C10.3771 6.99145 10.5 6.37378 10.5 5.75C10.5 5.12622 10.3771 4.50855 10.1384 3.93225C9.89972 3.35596 9.54984 2.83232 9.10876 2.39124C8.66768 1.95016 8.14404 1.60028 7.56775 1.36157C6.99145 1.12286 6.37378 1 5.75 1C4.49022 1 3.28204 1.50044 2.39124 2.39124C1.50044 3.28204 1 4.49022 1 5.75C1 7.00978 1.50044 8.21796 2.39124 9.10876C3.28204 9.99955 4.49022 10.5 5.75 10.5Z" stroke="#FCFCFC" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
						</svg>
					</div>
				</div>
			</div>
			<div className={style.sideBar__chats}>
				<TransitionGroup component={null}>
					{renderChats}
				</TransitionGroup>
			</div>
		</div>
	);
});

export default MessengerSideBar;