import { observer } from "mobx-react-lite";

import style from './editModal.module.scss'
import { useContext, useEffect, useRef, useState } from "react";
import { Context } from "../..";
import photo from '../../resource/graphics/images/profile/avatar.jpg'
import FunctionButton from "../functionButton/FunctionButton";
import { fetchGroups } from "../../http/groupsAPI";
import { updateUser } from "../../http/userAPI";


const EditModal = observer(() => {
	const { user, modal, profile } = useContext(Context);

	const [userName, setUserName] = useState('')
	const [userFullName, setUserFullName] = useState('')
	const [userAbout, setUserAbout] = useState(user.user.description)
	const [userOldPassword, setUserOldPassword] = useState('')
	const [userPassword, setUserPassword] = useState('')
	const [userEmail, setUserEmail] = useState('');
	const [userGroupId, setUserGroupId] = useState('');
	const [groups, setGroups] = useState([])


	useEffect(() => {
		fetchGroups().then((data) => {
			setGroups(data.rows);
		})
	}, [])

	const onButton = async () => {
		const formData = new FormData();
		formData.append("name", userName);
		formData.append("full_name", userFullName);
		formData.append("about", userAbout);
		formData.append("email", userEmail);
		formData.append("old_password", userOldPassword);
		formData.append("password", userPassword);
		formData.append("groupId", userGroupId);
		await updateUser(user.user.id, formData).then(data => {
			user.setUser(data);
			modal.setModalComplete(true);
			modal.setModalCompleteMessage('Изменения успешно обновлены')
			profile.setEditModal(false)
		}).catch(err => {
			if (err.response.data.message === 'повторяющееся значение ключа нарушает ограничение уникальности "users_name_key"') {
				modal.setModalErrorMessage("Никнейм занят");
			} else {
				modal.setModalErrorMessage(err.response.data.message);
			}
			modal.setModalError(true)

		})
	}

	return (
		<div className={style.editModal} onClick={(e) => e.stopPropagation()}>
			<h2 className={style.editModal__title}>Редактирование</h2>
			<div className={style.editModal__content}>
				<div className={style.editModal__input}>
					<p className={style.editModal__input__title}>Никнейм</p>
					<input autoComplete="new-password" type="text" placeholder={user.user.name} value={userName} onChange={(e) => setUserName(e.target.value)} className={style.editModal__input__item} />
				</div>
				<div className={style.editModal__input}>
					<p className={style.editModal__input__title}>ФИО</p>
					<input autoComplete="new-password" type="text" placeholder={user.user.full_name} value={userFullName} onChange={(e) => setUserFullName(e.target.value)} className={style.editModal__input__item} />
				</div>
				<div className={style.editModal__input}>
					<p className={style.editModal__input__title}>Обо мне</p>
					<textarea autoComplete="new-password" className={style.editModal__input__item} cols="30" rows="5" value={userAbout} onChange={(e) => setUserAbout(e.target.value)}>{userAbout}</textarea>
					{/* <textarea type="text" placeholder={user.user.full_name} value={userAbout} onChange={(e) => setUserAbout(e.target.value)} className={style.editModal__input__item} /> */}
				</div>
				<div className={style.editModal__input}>
					<p className={style.editModal__input__title}>Группа</p>
					<select onChange={(e) => setUserGroupId(e.target.value)} className={style.editModal__input__item}>
						{groups.map(item => {
							if (item.id === user.user.group.id) {
								return (
									<option key={item.id} value={item.id} selected>{item.name}</option>
								)
							} else {
								return <option key={item.id} value={item.id}>{item.name}</option>
							}

						})}
					</select>
				</div>
				<div className={style.editModal__input}>
					<p className={style.editModal__input__title}>Старый пароль</p>
					<input autoComplete="new-password" type="password" value={userOldPassword} onChange={(e) => setUserOldPassword(e.target.value)} className={style.editModal__input__item} />
				</div>
				<div className={style.editModal__input}>
					<p className={style.editModal__input__title}>Новый пароль</p>
					<input autoComplete="new-password" type="password" value={userPassword} onChange={(e) => setUserPassword(e.target.value)} className={style.editModal__input__item} />
				</div>
				<div className={style.editModal__input}>
					<p className={style.editModal__input__title}>Почта</p>
					<input autoComplete="new-password" type="text" placeholder={user.user.email} value={userEmail} onChange={(e) => setUserEmail(e.target.value)} className={style.editModal__input__item} />
				</div>
			</div>
			<FunctionButton onClick={onButton}>Сохранить</FunctionButton>
		</div>
	);
});

export default EditModal;