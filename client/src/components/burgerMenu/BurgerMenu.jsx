import React, { useContext, useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
	MESSENGER_ROUTE,
	NEWS_ROUTE,
	PROFILE_ROUTE,
	PROJECTS_ROUTE,
	GROUPS_ROUTE,
	REGISTRATION_ROUTE,
	LOGIN_ROUTE,
} from '../../utils/consts';
import MainButton from '../mainButton/MainButton';

import style from './burgerMenu.module.scss';

import close from '../../resource/graphics/icons/burgerMenu/closeIcon.svg';
import avatar from '../../resource/graphics/images/burgerMenu/avatar.jpg';
import { observer } from 'mobx-react-lite';
import { Context } from '../..';
import Cross from '../cross/Cross';

const BurgerMenu = observer(() => {
	const { user } = useContext(Context);
	const burgerTrigger = () => {
		user.setBurgerActive(!user.burgerActive);
	};

	const logout = () => {
		user.setUser({});
		user.setAuth(false);
		localStorage.removeItem('token');
	};
	return (
		<>
			<div className={user.burgerActive ? style.burgerActive : style.burger}>
				<div className={style.close}>
					<Cross onClick={() => burgerTrigger()} />
				</div>
				<div className={style.avatarBlock}>
					<img
						src={
							user.isAuth
								? process.env.REACT_APP_API_URL + user.user.avatar
								: process.env.REACT_APP_API_URL + 'avatar.jpg'
						}
						alt="img"
						className={style.avatar}
					/>
				</div>
				{user.isAuth && <h2 className={style.name}>{user.user.name}</h2>}
				{user.isAuth ? (
					<MainButton
						path={PROFILE_ROUTE + '/' + user.user.id}
						title={'Перейти в профиль'}
						onClick={() => burgerTrigger()}
					/>
				) : (
					<MainButton path={LOGIN_ROUTE} title={'Войти в аккаунт'} onClick={() => burgerTrigger()} />
				)}
				{!user.isAuth && (
					<h2 className={style.notAuth}>
						Нет аккаунта?{' '}
						<Link to={REGISTRATION_ROUTE} className={style.notAuth__path} onClick={() => burgerTrigger()}>
							Регистрация
						</Link>
					</h2>
				)}
				<ul className={style.menu}>
					{user.isAuth
						? user.user.roleId > 1
							? user.menuAdmin.map(({ id, title, groupName, icon, path }) => {
								return (
									<Link className={style.menu__item__text} to={path} onClick={() => burgerTrigger()} key={id}>
										<li className={style.menu__item}>
											<img src={icon} alt="icon" />
											{title}
											{
												groupName && <span className={style.menu__itemGroupName}>({groupName})</span>
											}
										</li>
									</Link>
								);
							})
							:
							user.menuAuth.map(({ id, title, groupName, icon, path }) => {
								return (
									<Link className={style.menu__item__text} to={path} onClick={() => burgerTrigger()} key={id}>
										<li className={style.menu__item}>
											<img src={icon} alt="icon" />
											{title}
											{
												groupName && <span className={style.menu__itemGroupName}>({groupName})</span>
											}
										</li>
									</Link>
								);
							})
						: user.menu.map(({ id, title, icon, path }) => {
							return (
								<Link className={style.menu__item__text} to={path} onClick={() => burgerTrigger()} key={id}>
									<li className={style.menu__item}>
										<img src={icon} alt="icon" />
										{title}
									</li>
								</Link>
							);
						})}
				</ul>
				{user.isAuth && (
					<button className={style.logout} onClick={logout}>
						Выйти
					</button>
				)}
			</div>
			<div
				className={!user.burgerActive ? style.popup : `${style.popup} ${style.popup_active}`}
				onClick={() => user.setBurgerActive(false)}
			></div>
		</>
	);
});

export default BurgerMenu;
