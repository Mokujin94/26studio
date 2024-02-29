import { createRef, useContext, useEffect, useState } from 'react';

import './passwordRecovery.scss'

import { Context } from '../..';
import emailjs from "@emailjs/browser";
import { CSSTransition, SwitchTransition } from 'react-transition-group';
import RegistrationStages from '../../components/registrationStages/RegistrationStages';
import { Link } from 'react-router-dom';
import { LOGIN_ROUTE } from '../../utils/consts';
import PrimaryButton from '../../components/primaryButton/PrimaryButton';
import { fetchUserByEmail } from '../../http/userAPI';
import ModalError from '../../components/modalError/ModalError';
import InputPassword from '../../components/inputPassword/InputPassword';
import { observer } from 'mobx-react-lite';

const PasswordRecovery = observer(() => {
	const { user } = useContext(Context)

	const [stages, setStages] = useState(1);
	const [loading, setLoading] = useState(false);
	const [email, setEmail] = useState("")
	const [errorModal, setErrorModal] = useState(false);
	const [errorMessage, setErrorMessage] = useState("");
	const [incorrectMail, setIncorrectMail] = useState(false);
	const [code, setCode] = useState("");
	const [valuePassword, setValuePassword] = useState("");
	const [valuePasswordConfirm, setValuePasswordConfirm] = useState("");

	const [number1, setNumber1] = useState("");
	const [number2, setNumber2] = useState("");
	const [number3, setNumber3] = useState("");
	const [number4, setNumber4] = useState("");
	const [number5, setNumber5] = useState("");
	const [number6, setNumber6] = useState("");

	const input1 = createRef();
	const input2 = createRef();
	const input3 = createRef();
	const input4 = createRef();
	const input5 = createRef();
	const input6 = createRef();

	const onStage1 = async () => {
		setStages(1);
  };

  const onStage2 = async () => {
		if(stages === 1) {
			if(!email) {
				setErrorMessage('Введите почту')
				setErrorModal(true)
				return
			}
			if(incorrectMail) {
				setErrorMessage('Не корректная почта')
				setErrorModal(true)
				return
			}
			await fetchUserByEmail(email)
				.then(() => {
					setStages((item) => item + 1);
					user.setCodeAuth(
						Math.floor(Math.random() * (999999 - 100000 + 1) + 100000)
					);
				})
				.catch((err) => {
					if (err.response) {
						setErrorMessage(err.response.data.message);
						setErrorModal(true);
					} else {
						setErrorMessage(err.message);
						setErrorModal(true);
					}
				});
		}
  };

  const onStage3 = async () => {
		if(stages === 1) {
			if (!email) {
				setErrorMessage('Введите почту')
				setErrorModal(true)
				return
			}
			if(incorrectMail) {
				setErrorMessage('Не корректная почта')
				setErrorModal(true)
				return
			}
			await fetchUserByEmail(email)
				.then(() => {
					setStages((item) => item + 1);
					user.setCodeAuth(
						Math.floor(Math.random() * (999999 - 100000 + 1) + 100000)
					);
				})
				.catch((err) => {
					if (err.response) {
						setErrorMessage(err.response.data.message);
						setErrorModal(true);
					} else {
						setErrorMessage(err.message);
						setErrorModal(true);
					}
				});
		}
  };

	const validationEmail = (e) => {
		setEmail(e.target.value)
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
			setIncorrectMail(true)
		} else {
			setIncorrectMail(false)
		}
	}

	const onChange = (e) => {
		const id = e.target.attributes.id.value;
		if (e.target.value.length <= 1 && /\d+/.test(Number(e.target.value))) {
			if (id === "1") {
				setNumber1(e.target.value);
				if (!e.target.value) return input1.current.focus();
				input2.current.focus();
			} else if (id === "2") {
				setNumber2(e.target.value);
				if (!e.target.value) return input1.current.focus();
				input3.current.focus();
			} else if (id === "3") {
				setNumber3(e.target.value);
				if (!e.target.value) return input2.current.focus();
				input4.current.focus();
			} else if (id === "4") {
				setNumber4(e.target.value);
				if (!e.target.value) return input3.current.focus();
				input5.current.focus();
			} else if (id === "5") {
				setNumber5(e.target.value);
				if (!e.target.value) return input4.current.focus();
				input6.current.focus();
			} else if (id === "6") {
				setNumber6(e.target.value);
				if (!e.target.value) return input5.current.focus();
			}
		}
	};

	const onDeleteBox = (e) => {
		const id = e.target.attributes.id.value;
		if (e.keyCode === 8 && !e.target.value) {
			if (id === "1") {
			} else if (id === "2") {
				input1.current.focus();
			} else if (id === "3") {
				input2.current.focus();
			} else if (id === "4") {
				input3.current.focus();
			} else if (id === "5") {
				input4.current.focus();
			} else if (id === "6") {
				input5.current.focus();
			}
		}

		let nextId = Number(id) + 1;
		if (
			e.target.value.length >= 1 &&
			nextId <= 6 &&
			/\d+/.test(Number(e.key))
		) {
			eval(`input${nextId}.current.focus()`);
			eval(`setNumber${nextId}(e.key)`);
		}
	};

	const onPasteCode = (e) => {
		const pastedData = (e.clipboardData || window.clipboardData).getData('text').replace(/\D/g, '');
		
		const firstSixChars = pastedData.slice(0, 6);
		// Разбиваем каждый символ на элементы массива
		const charactersArray = firstSixChars.split('');
		// Выводим данные в консоль
		charactersArray.forEach((item, i) => {
			eval(`setNumber${i + 1}(${item})`)
			eval(`input${i+1}.current.focus()`)
		});
	}

	const onButton = async () => {
		setLoading(true)
		if(stages === 1) {
			if(!email) {
				setLoading(false)
				setErrorMessage('Введите почту')
				setErrorModal(true)
				return
			}
			if(incorrectMail) {
				setLoading(false)
				setErrorMessage('Не корректная почта')
				setErrorModal(true)
				return
			}
			await fetchUserByEmail(email)
				.then(() => {
					setStages((item) => item + 1);
					user.setCodeAuth(
						Math.floor(Math.random() * (999999 - 100000 + 1) + 100000)
					);
				})
				.catch((err) => {
					if (err.response) {
						setErrorMessage(err.response.data.message);
						setErrorModal(true);
						setLoading(false);
					} else {
						setErrorMessage(err.message);
						setErrorModal(true);
					}
				});
			setLoading(false)
		} else if(stages === 3) {
			setLoading(false)
		}
	}

	const validationPassword = (e) => {
		setValuePassword(e.target.value);
		if (e.target.value.length < 6) {
			const newError = {
				id: 3,
				errors: [
					{
						id: 1,
						name: "Длина пароля не менее 6 символов",
					},
				],
			};
			user.setErrorAuth(newError);
		} else {
			const newError = {
				id: 3,
				errors: [],
			};
			user.setErrorAuth(newError);
		}
	};

	const validationPasswordConfirm = (e) => {
		setValuePasswordConfirm(e.target.value);
		if (e.target.value !== valuePassword) {
			const newError = {
				id: 4,
				errors: [
					{
						id: 1,
						name: "Пароли не совпадают",
					},
				],
			};
			user.setErrorAuth(newError);
		} else {
			const newError = {
				id: 4,
				errors: [],
			};
			user.setErrorAuth(newError);
		}
	};

	useEffect(() => {
		setCode(
			`${number1}` +
				`${number2}` +
				`${number3}` +
				`${number4}` +
				`${number5}` +
				`${number6}`
		);
	}, [number1, number2, number3, number4, number5, number6]);

	useEffect(() => {
		console.log(user.codeAuth, code);
		if (code == user.codeAuth) {
			// registrationAccept();
			setStages(3)
		} else if (code.length === 6 && code !== user.codeAuth) {
			setErrorMessage("Не верный код");
			setErrorModal(true);
		}
	}, [code]);

	

	return (
			<div className='password-recovery'>
				<CSSTransition
					in={errorModal}
					timeout={0}
					classNames="node"
					unmountOnExit
				>
					<div className="password-recovery__errors">
						<ModalError error={errorMessage} setErrorModal={setErrorModal} />
					</div>
				</CSSTransition>
				<Link to={LOGIN_ROUTE} className="password-recovery__back-page">
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
				<div className="password-recovery__top">
					<h1 className="password-recovery__title">Восстановление пароля</h1>
					<RegistrationStages
						stages={stages}
						onStage1={onStage1}
						onStage2={onStage2}
						onStage3={onStage3}
						textStage1='Аккаунт'
						textStage2='Код с почты'
						textStage3='Новый пароль'
					/>
				</div>
				
				<SwitchTransition mode="out-in">
					<CSSTransition key={stages} timeout={300} classNames="node">
						<div className="password-recovery__stage">
							{stages === 1 ? (
								<div className="password-recovery__stage-item">
									<h2 className="password-recovery__stage-title">Почта</h2>
									<input 
										className="password-recovery__stage-input" 
										type="email" 
										value={email} 
										onChange={validationEmail} 
										style={
											incorrectMail && email
												? { border: "2px solid rgb(255, 149, 149)" }
												: null
										}
										/>
								</div>
							) : stages === 2 ? (
								<div className="password-recovery__stage-code">
									<h2 className="password-recovery__stage-title">Код подтверждения</h2>
									<div className="password-recovery__stage-code-wrapper">
										<input
											type="text"
											onChange={(e) => onChange(e)}
											onPaste={(e) => onPasteCode(e)}
											onKeyDown={(e) => onDeleteBox(e)}
											value={number1}
											id="1"
											ref={input1}
											className={
												number1
													? "password-recovery__stage-code-input password-recovery__stage-code-input_active"
													: "password-recovery__stage-code-input"
											}
										/>
										<input
											type="text"
											onChange={(e) => onChange(e)}
											onPaste={(e) => onPasteCode(e)}
											onKeyDown={(e) => onDeleteBox(e)}
											value={number2}
											id="2"
											ref={input2}
											className={
												number2
													? "password-recovery__stage-code-input password-recovery__stage-code-input_active"
													: "password-recovery__stage-code-input"
											}
										/>
										<input
											type="text"
											onChange={(e) => onChange(e)}
											onPaste={(e) => onPasteCode(e)}
											onKeyDown={(e) => onDeleteBox(e)}
											value={number3}
											id="3"
											ref={input3}
											className={
												number3
													? "password-recovery__stage-code-input password-recovery__stage-code-input_active"
													: "password-recovery__stage-code-input"
											}
										/>
										<input
											type="text"
											onChange={(e) => onChange(e)}
											onPaste={(e) => onPasteCode(e)}
											onKeyDown={(e) => onDeleteBox(e)}
											value={number4}
											id="4"
											ref={input4}
											className={
												number4
													? "password-recovery__stage-code-input password-recovery__stage-code-input_active"
													: "password-recovery__stage-code-input"
											}
										/>
										<input
											type="text"
											onChange={(e) => onChange(e)}
											onPaste={(e) => onPasteCode(e)}
											onKeyDown={(e) => onDeleteBox(e)}
											value={number5}
											id="5"
											ref={input5}
											className={
												number5
													? "password-recovery__stage-code-input password-recovery__stage-code-input_active"
													: "password-recovery__stage-code-input"
											}
										/>
										<input
											type="text"
											onChange={(e) => onChange(e)}
											onPaste={(e) => onPasteCode(e)}
											onKeyDown={(e) => onDeleteBox(e)}
											value={number6}
											id="6"
											ref={input6}
											className={
												number6
													? "password-recovery__stage-code-input password-recovery__stage-code-input_active"
													: "password-recovery__stage-code-input"
											}
										/>
									</div>
								</div>
							) : stages === 3 ? (
								<div className="password-recovery__stage-new-password">
									<div className="password-recovery__stage-item">
										<h2 className="password-recovery__stage-title">Новый пароль</h2>
										<input type="text" className="password-recovery__stage-input" value={valuePassword} onChange={validationPassword}/>
									</div>
									<div className="password-recovery__stage-item">
										<h2 className="password-recovery__stage-title">Повторите новый пароль</h2>
										<input type="text" className="password-recovery__stage-input" value={valuePasswordConfirm} onChange={validationPasswordConfirm}/>
									</div>
								</div>
							) : null}
						</div>
					</CSSTransition>
				</SwitchTransition>

					<div className="password-recovery__stage-bottom" 
						style={
							stages == 2 ? {opacity: "0", pointerEvents: 'none', transitionDelay: "0s"} : null
						}
					>
						<PrimaryButton
							onButton={onButton}
							loading={loading}
						>
							Далее
						</PrimaryButton>
					</div>
				
			</div>
		
	);
});

export default PasswordRecovery;