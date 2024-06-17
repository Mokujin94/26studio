import { observer } from "mobx-react-lite";

import style from './editModal.module.scss'
import { useContext, useEffect, useRef, useState } from "react";
import { Context } from "../..";
import photo from '../../resource/graphics/images/profile/avatar.jpg'
import FunctionButton from "../functionButton/FunctionButton";
import { fetchGroups } from "../../http/groupsAPI";
import { updateUser } from "../../http/userAPI";
import Cross from "../cross/Cross";


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

	const [isDisabled, setIsDisabled] = useState(true);

	const [errorName, setErrorName] = useState('')
	const [isErrorName, setIsErrorName] = useState(false)

	const [errorFullName, setErrorFullName] = useState('')
	const [isErrorFullName, setIsErrorFullName] = useState(false)

	const [errorAbout, setErrorAbout] = useState('')
	const [isErrorAbout, setIsErrorAbout] = useState(false)
	const [aboutCount, setAboutCount] = useState(350 - userAbout.length)

	const [errorOldPassword, setErrorOldPassword] = useState('')

	const [errorPassword, setErrorPassword] = useState('')
	const [isErrorPassword, setIsErrorPassword] = useState(false)

	const [errorEmail, setErrorEmail] = useState('')
	const [isErrorEmail, setIsErrorEmail] = useState(false)

	const [isError, setIsError] = useState(false)


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

	useEffect(() => {
		if (!userName && !userFullName && (!userAbout || userAbout === user.user.description) && !userOldPassword && !userPassword && !userEmail && !userGroupId) {
			setIsDisabled(true)
		} else {
			setIsDisabled(false)
		}
	}, [userName, userFullName, userAbout, userOldPassword, userPassword, userEmail, userGroupId])

	useEffect(() => {
		if (isErrorName || isErrorFullName || isErrorAbout || isErrorPassword || isErrorEmail) {
			setIsError(true);
			return
		}
		setIsError(false)
	}, [isErrorName, isErrorFullName, isErrorAbout, isErrorPassword, isErrorEmail])

	const onUserName = (e) => {
		setUserName(e.target.value)
		if (e.target.value.length === 0) {
			setIsErrorName(false);
			return;
		}
		let match = /^[a-z0-9]*$/i.test(e.target.value.replaceAll(" ", ""));
		if (!match || e.target.value.length < 4) {
			setErrorName('Некорректное имя (Допускаются латиница и цифры)')
			setIsErrorName(true);
		} else if (e.target.value.length > 15) {
			setErrorName('Максимальная длина никнейма 15 символов')
			setIsErrorName(true);
		} else {
			setIsErrorName(false);
		}
	}

	const onUserFullName = (e) => {
		setUserFullName(e.target.value);
		if (e.target.value.length === 0) {
			setIsErrorFullName(false);
			return;
		}
		let match = /^[а-яё]*$/i.test(e.target.value.replaceAll(" ", ""));
		let secondSpace = e.target.value.indexOf(
			" ",
			1 + e.target.value.indexOf(" ")
		);
		let firstWord = e.target.value.slice(
			0,
			e.target.value.indexOf(" ") === -1
				? e.target.value.length
				: e.target.value.indexOf(" ") + 1
		);
		let checkSpaceFristWord = firstWord.indexOf(" ");
		let secondWord = e.target.value.slice(
			firstWord.length,
			secondSpace === -1 ? e.target.value.length : secondSpace + 1
		);
		let checkSpaceSecondWord = secondWord.indexOf(" ");
		let thirdWord = e.target.value.slice(
			secondSpace === -1 ? e.target.value.length + 1 : secondSpace + 1,
			e.target.value.length
		);
		let checkSpaceThirdWord = thirdWord.indexOf(" ");
		if (
			checkSpaceFristWord === 0 ||
			checkSpaceSecondWord === 0 ||
			checkSpaceThirdWord !== -1 ||
			(secondSpace !== -1 && !thirdWord) ||
			(thirdWord && checkSpaceSecondWord === -1)
		) {
			setErrorFullName('ФИО не должно содержать пробелы в начале или в конце')
			setIsErrorFullName(true);
		} else if (!secondWord || !match || checkSpaceFristWord === -1) {
			setErrorFullName('Фамилия и имя обязательны для заполнения (киррилица)')
			setIsErrorFullName(true);
		} else if (firstWord.length < 3 || (secondWord && secondWord.length < 2)) {
			setErrorFullName('Некорректное ФИО')
			setIsErrorFullName(true);
		} else {
			setIsErrorFullName(false);
		}
	};

	const onUserAbout = (e) => {
		setUserAbout(e.target.value.slice(0, 350));
		setAboutCount(350 - e.target.value.slice(0, 350).length)
	}

	const onPassword = (e) => {
		setUserPassword(e.target.value);
		if (e.target.value.length === 0) {
			setIsErrorPassword(false);
			return;
		}
		if (e.target.value.length < 6) {
			setErrorPassword('Минимальная длина пароля 6 символов')
			setIsErrorPassword(true);
		} else {
			setIsErrorPassword(false);
		}
	}

	const onUserEmail = (e) => {
		setUserEmail(e.target.value);
		if (e.target.value.length === 0) {
			setIsErrorEmail(false);
			return;
		}
		let checkMail = e.target.value.indexOf("@");
		let beforeMailWord = e.target.value.slice(
			0,
			checkMail !== -1 ? checkMail : e.target.value.length
		);
		let afterMail = e.target.value.slice(
			beforeMailWord.length + 1,
			e.target.value.length
		);

		let afterMailWord = e.target.value.slice(
			checkMail !== -1 ? checkMail + 1 : e.target.value.length + 1,
			e.target.value.length
		);
		let checkDot = afterMailWord.indexOf(".");
		let afterDot = afterMailWord.slice(
			checkDot !== -1 ? checkDot + 1 : e.target.value.length + 1,
			e.target.value.length
		);
		if (
			!checkMail ||
			!beforeMailWord ||
			!afterMailWord ||
			!checkDot ||
			afterDot.length < 2
		) {
			setErrorEmail('Не корректная почта')
			setIsErrorEmail(true);
		} else {
			setIsErrorEmail(false);
		}
	}

	return (
		<div className={style.editModal} onMouseDown={(e) => e.stopPropagation()}>
			<div className={style.editModal__close}>
				<Cross onClick={() => profile.setEditModal(false)} />
			</div>
			<h2 className={style.editModal__title}>Редактирование</h2>
			<div className={style.editModal__content}>
				<div className={style.editModal__input}>
					<p className={style.editModal__input__title}>Никнейм</p>
					<input autoComplete="new-password" type="text" placeholder={user.user.name} value={userName} onChange={onUserName} className={isErrorName && userName.length !== 0 ? style.editModal__input__item + " " + style.editModal__input__item_error : style.editModal__input__item} />
					<div className={isErrorName && userName.length !== 0 ? style.editModal__error__wrapper + " " + style.editModal__error__wrapper_active : style.editModal__error__wrapper}>
						<span className={style.editModal__error}>{errorName}</span>
					</div>
				</div>
				<div className={style.editModal__input}>
					<p className={style.editModal__input__title}>ФИО</p>
					<input autoComplete="new-password" type="text" placeholder={user.user.full_name} value={userFullName} onChange={onUserFullName} className={isErrorFullName && userFullName.length !== 0 ? style.editModal__input__item + " " + style.editModal__input__item_error : style.editModal__input__item} />
					<div className={isErrorFullName && userFullName.length !== 0 ? style.editModal__error__wrapper + " " + style.editModal__error__wrapper_active : style.editModal__error__wrapper}>
						<span className={style.editModal__error}>{errorFullName}</span>
					</div>
				</div>
				<div className={style.editModal__input}>
					<p className={style.editModal__input__title}>Обо мне <span>({aboutCount})</span></p>
					<textarea placeholder="Расскажите о себе" autoComplete="new-password" className={style.editModal__input__item} cols="30" rows="5" value={userAbout} onChange={onUserAbout}>{userAbout}</textarea>
					{/* {errorFullName.length > 0 && userFullName.length !== 0 ? <span className={style.editModal__error}>{errorName}</span> : null} */}
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
					<input autoComplete="new-password" type="password" value={userPassword} onChange={onPassword} className={isErrorPassword && userPassword.length !== 0 ? style.editModal__input__item + " " + style.editModal__input__item_error : style.editModal__input__item} />
					<div className={isErrorPassword && userPassword.length !== 0 ? style.editModal__error__wrapper + " " + style.editModal__error__wrapper_active : style.editModal__error__wrapper}>
						<span className={style.editModal__error}>{errorPassword}</span>
					</div>
				</div>
				<div className={style.editModal__input}>
					<p className={style.editModal__input__title}>Почта</p>
					<input autoComplete="new-password" type="text" placeholder={user.user.email} value={userEmail} onChange={onUserEmail} className={isErrorEmail && userEmail.length !== 0 ? style.editModal__input__item + " " + style.editModal__input__item_error : style.editModal__input__item} />
					<div className={isErrorEmail && userEmail.length !== 0 ? style.editModal__error__wrapper + " " + style.editModal__error__wrapper_active : style.editModal__error__wrapper}>
						<span className={style.editModal__error}>{errorEmail}</span>
					</div>
				</div>
			</div>
			<FunctionButton disabled={isDisabled || isError} onClick={onButton}>Сохранить</FunctionButton>
		</div>
	);
});

export default EditModal;