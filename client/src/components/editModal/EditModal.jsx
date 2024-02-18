import { observer } from "mobx-react-lite";

import style from './editModal.module.scss'
import { useContext } from "react";
import { Context } from "../..";


const EditModal = observer(() => {
	const { user } = useContext(Context);

	console.log(user.user)
	return (
		<div className={style.editModal} onClick={(e) => e.stopPropagation()}>
			<h2 className={style.editModal__title}>Редактирование</h2>
			<div className={style.editModal__content}>
				<div className={style.editModal__input}>
					<p className={style.editModal__input__title}>Имя</p>
					<input type="text" value={user.user.name} className={style.editModal__input__item} />
				</div>
				<div className={style.editModal__input}>
					<p className={style.editModal__input__title}>ФИО</p>
					<input type="text" value={user.user.full_name} className={style.editModal__input__item} />
				</div>
				<div className={style.editModal__input}>
					<p className={style.editModal__input__title}>Группа</p>
					<select className={style.editModal__input__item}>
						<option value="">{user.user.group.name}</option>
					</select>
				</div>
				<div className={style.editModal__avatar}>
					<div className={style.editModal__avatar__img}>
						<img src={''} alt="" />
					</div>
					<div className={style.editModal__input}>
						<p className={style.editModal__input__title}>Имя</p>
						<input type="file" className={style.editModal__input__item} />
					</div>
				</div>
				<div className={style.editModal__input}>
					<p className={style.editModal__input__title}>Новый пароль</p>
					<input type="text" className={style.editModal__input__item} />
				</div>
				<div className={style.editModal__input}>
					<p className={style.editModal__input__title}>Почта</p>
					<input type="text" value={user.user.email} className={style.editModal__input__item} />
				</div>
				<div className={style.editModal__btn}>
					<button className={style.editModal__btn__item}>Сохранить</button>
				</div>
			</div>
		</div>
	);
});

export default EditModal;