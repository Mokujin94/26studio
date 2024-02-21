import { observer } from "mobx-react-lite";

import style from './editModal.module.scss'
import { useContext, useRef, useState } from "react";
import { Context } from "../..";
import photo from '../../resource/graphics/images/profile/avatar.jpg'
import FunctionButton from "../functionButton/FunctionButton";


const EditModal = observer(() => {
	const { user } = useContext(Context);

	const [userName, setUserName] = useState('')
	const [userFullName, setUserFullName] = useState('')
	const [userPassword, setUserPassword] = useState('')
	const [userEmail, setUserEmail] = useState('')

	return (
		<div className={style.editModal} onClick={(e) => e.stopPropagation()}>
			<h2 className={style.editModal__title}>Редактирование</h2>
			<div className={style.editModal__content}>
				<div className={style.editModal__input}>
					<p className={style.editModal__input__title}>Имя</p>
					<input type="text" placeholder={user.user.name} value={userName} onChange={(e) => setUserName(e.target.value)} className={style.editModal__input__item} />
				</div>
				<div className={style.editModal__input}>
					<p className={style.editModal__input__title}>ФИО</p>
					<input type="text" placeholder={user.user.full_name} value={userFullName} onChange={(e) => setUserFullName(e.target.value)} className={style.editModal__input__item} />
				</div>
				<div className={style.editModal__input}>
					<p className={style.editModal__input__title}>Группа</p>
					<select className={style.editModal__input__item}>
						<option value="">{user.user.group.name}</option>
					</select>
				</div>
				<div className={style.editModal__input}>
					<p className={style.editModal__input__title}>Новый пароль</p>
					<input type="text" value={userPassword} onChange={(e) => setUserPassword(e.target.value)} className={style.editModal__input__item} />
				</div>
				<div className={style.editModal__input}>
					<p className={style.editModal__input__title}>Почта</p>
					<input type="text" placeholder={user.user.email} value={userEmail} onChange={(e) => setUserEmail(e.target.value)} className={style.editModal__input__item} />
				</div>
			</div>
			<FunctionButton>Сохранить</FunctionButton>
		</div>
	);
});

export default EditModal;