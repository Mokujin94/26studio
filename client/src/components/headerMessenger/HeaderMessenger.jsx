import { useContext, useRef, useState } from 'react';
import style from './headerMessenger.module.scss'
import { Context } from '../..';

import burger from "../../resource/graphics/icons/burgerMenu/burger.svg";
import CreateButtonPopUp from '../createButtonPopUp/CreateButtonPopUp';
import Notification from '../notification/Notification';


const HeaderMessenger = () => {
	const { user } = useContext(Context);
	const [activeCreatePopup, setActiveCreatePopup] = useState(false);
	const [activeNotifications, setActiveNotifications] = useState(false)
	const createPopupRef = useRef(null);
	const notificationsRef = useRef(null)

	return (
		<div className={style.headerMessenger}>
			<div className="container">
				<div className={style.headerMessenger__wrapper}>
					<div
						className={style.headerMessenger__burgerBtn}
						onClick={() => user.setBurgerActive(!user.burgerActive)}
						style={{ userSelect: "none" }}
					>
						<img src={burger} alt="icon" />
					</div>
					<div className={style.headerMessenger__createButtonPopUp}>
						<Notification
							notificationsRef={notificationsRef}
							setActiveNotifications={setActiveNotifications}
							activeNotifications={activeNotifications}
						/>
						<CreateButtonPopUp
							createPopupRef={createPopupRef}
							setActiveCreatePopup={setActiveCreatePopup}
							activeCreatePopup={activeCreatePopup}
						/>
						{/* <ThemeChangeButton /> */}
					</div>
				</div>
			</div>
		</div>
	);
};

export default HeaderMessenger;