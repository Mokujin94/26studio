import React, { useContext, useEffect, useState } from "react";

import { Link, useNavigate } from "react-router-dom";

import FunctionButton from "../../components/functionButton/FunctionButton";
import { Context } from "../..";
import { login } from "../../http/userAPI";
import { NEWS_ROUTE, PASSWORDRECOVERY_ROUTE } from "../../utils/consts";
import Spinner from "../../components/spinner/Spinner";
import ModalError from "../../components/modalError/ModalError";
import { CSSTransition } from "react-transition-group";

function Auth() {
	const { user } = useContext(Context);
	const [email, setEmail] = useState();
	const [password, setPassword] = useState();
	const [errorMessage, setErrorMessage] = useState("");
	const [errorModal, setErrorModal] = useState(false);
	const [loading, setLoading] = useState(false);
	const [isEyeOpen, setIsEyeOpen] = useState(false)


	const navigate = useNavigate();
	const onLogin = async (e) => {
		e.preventDefault();
		setLoading(true);
		await login(email, password).then((data) => {
			setLoading(false);
			user.setUser(data);
			user.setAuth(true);
			navigate(NEWS_ROUTE);
		}).catch((err) => {
			setLoading(false);
			setErrorModal(true);
			setErrorMessage(err.response.data.message)
			// setErrorMessage(err)
		});
	};

	useEffect(() => {
		document.title = "Авторизация";
	}, [])
	return (
		<div className="auth">
			<CSSTransition
				in={errorModal}
				timeout={0}
				classNames="node"
				unmountOnExit
			>
				<div className="auth__errors">
					<ModalError error={errorMessage} setErrorModal={setErrorModal} />
				</div>
			</CSSTransition>
			<Link to="/news" className="auth__back-page">
				<svg
					width="25"
					height="22"
					viewBox="0 0 25 22"
					fill="none"
					xmlns="http://www.w3.org/2000/svg"
				>
					<path
						fill-rule="evenodd"
						clip-rule="evenodd"
						d="M24.5514 9.8524C24.2587 9.55919 23.8614 9.39428 23.4471 9.39396L5.34596 9.38003L12.0597 2.67969C12.3533 2.38656 12.5184 1.9888 12.5188 1.57392C12.5191 1.15904 12.3546 0.76103 12.0614 0.467441C11.7683 0.173853 11.3705 0.00873723 10.9557 0.00841797C10.5408 0.00809871 10.1428 0.172602 9.84919 0.465739L0.468027 9.83247C0.322421 9.97749 0.206855 10.1498 0.127948 10.3396C0.0490404 10.5293 0.00834236 10.7327 0.00818422 10.9382C0.00802609 11.1437 0.0484109 11.3473 0.127026 11.5371C0.205641 11.727 0.320942 11.8995 0.466324 12.0447L9.83306 21.4259C9.97821 21.5713 10.1506 21.6866 10.3403 21.7654C10.53 21.8441 10.7334 21.8848 10.9388 21.8849C11.1443 21.8851 11.3477 21.8448 11.5376 21.7663C11.7274 21.6878 11.8999 21.5727 12.0453 21.4276C12.1907 21.2824 12.306 21.1101 12.3848 20.9204C12.4636 20.7306 12.5042 20.5272 12.5043 20.3218C12.5045 20.1164 12.4642 19.9129 12.3857 19.7231C12.3073 19.5332 12.1922 19.3607 12.047 19.2153L5.34355 12.5047L23.4447 12.5186C23.859 12.5189 24.2565 12.3546 24.5497 12.0619C24.8429 11.7691 25.0079 11.3718 25.0082 10.9575C25.0085 10.5431 24.8442 10.1456 24.5514 9.8524Z"
						fill="#FCFCFC"
					/>
				</svg>
			</Link>
			<h1 className="auth__title">Вход</h1>
			<form className="auth__form">
				<div className="auth__input">
					<h2 className="auth__input-title">Почта</h2>
					<div className="auth__input-inner">
						<input
							onChange={(e) => setEmail(e.target.value)}
							type="email"
							className="auth__input-item"
						/>
					</div>
				</div>
				<div className="auth__input">
					<h2 className="auth__input-title">Пароль</h2>
					<div className="auth__input-inner">
						<input
							onChange={(e) => setPassword(e.target.value)}
							type={isEyeOpen ? "text" : "password"}
							className="auth__input-item"
						/>
						<div className="auth__input-eye" onClick={() => setIsEyeOpen(prev => !prev)}>
							{
								isEyeOpen
									?
									<svg width="800px" height="800px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
										<g id="SVGRepo_bgCarrier" stroke-width="0" />
										<g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round" />
										<g id="SVGRepo_iconCarrier"> <path d="M2.99902 3L20.999 21M9.8433 9.91364C9.32066 10.4536 8.99902 11.1892 8.99902 12C8.99902 13.6569 10.3422 15 11.999 15C12.8215 15 13.5667 14.669 14.1086 14.133M6.49902 6.64715C4.59972 7.90034 3.15305 9.78394 2.45703 12C3.73128 16.0571 7.52159 19 11.9992 19C13.9881 19 15.8414 18.4194 17.3988 17.4184M10.999 5.04939C11.328 5.01673 11.6617 5 11.9992 5C16.4769 5 20.2672 7.94291 21.5414 12C21.2607 12.894 20.8577 13.7338 20.3522 14.5" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" /> </g>
									</svg>
									:
									<svg width="800px" height="800px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
										<g id="SVGRepo_bgCarrier" stroke-width="0" />
										<g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round" />
										<g id="SVGRepo_iconCarrier"> <path d="M15.0007 12C15.0007 13.6569 13.6576 15 12.0007 15C10.3439 15 9.00073 13.6569 9.00073 12C9.00073 10.3431 10.3439 9 12.0007 9C13.6576 9 15.0007 10.3431 15.0007 12Z" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" /> <path d="M12.0012 5C7.52354 5 3.73326 7.94288 2.45898 12C3.73324 16.0571 7.52354 19 12.0012 19C16.4788 19 20.2691 16.0571 21.5434 12C20.2691 7.94291 16.4788 5 12.0012 5Z" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" /> </g>
									</svg>
							}
						</div>
					</div>
				</div>
				<Link to={PASSWORDRECOVERY_ROUTE} className="auth__forget">
					Забыли пароль?
				</Link>
				<FunctionButton onClick={onLogin}>{loading ? <Spinner /> : 'Войти'}</FunctionButton>
				<div className="auth__notAuth">
					<p className="auth__notAuthText">Нет аккаунта?</p>
					<Link to="/registration" className="auth__notAuthLink">
						Зарегистрироваться
					</Link>
				</div>
			</form>
		</div>
	);
}

export default Auth;
