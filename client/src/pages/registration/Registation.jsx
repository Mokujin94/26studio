import React, { useContext, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import RegistrationStages from "../../components/registrationStages/RegistrationStages";
import FirstStageReg from "../../components/firstStageReg/FirstStageReg";
import SecondStageReg from "../../components/secondStageReg/SecondStageReg";
import ThirdStageReg from "../../components/thirdStageReg/ThirdStageReg";
import PrimaryButton from "../../components/primaryButton/PrimaryButton";

import "./registration.scss";

import { CSSTransition, SwitchTransition } from "react-transition-group";
import { observer } from "mobx-react-lite";
import ModalError from "../../components/modalError/ModalError";
import ModalComplete from "../../components/modalComplete/ModalComplete";
import { Context } from "../..";
import { checkCondidate, generateCode } from "../../http/userAPI";
import emailjs from "@emailjs/browser";

const Registation = observer(() => {
	const { user } = useContext(Context)
	const [stages, setStages] = useState(1);
	const [errorMessage, setErrorMessage] = useState("");
	const [errorModal, setErrorModal] = useState(false);
	const [completeMessage, setCompleteMessage] = useState("");
	const [completeModal, setCompleteModal] = useState(false);
  const [errorValidation, setErrorValidation] = useState(false);
	const [loading, setLoading] = useState(false);

	const nodeRef = useRef(null);

	useEffect(() => {
		document.title = "Регистрация"
	}, [])

	const sendParams = {
    email_to: user.dataAuth.email,
    code: user.codeAuth,
  };

	const isErrorStage1 = async () => {
    if (stages === 3) {
    } else {
      setStages(1);
    }
  };

  const isErrorStage2 = async () => {
    const response = await checkCondidate(
      user.dataAuth.name,
      user.dataAuth.email
    )
      .then(() => {
        if (
          (stages === 1 && !user.dataAuth.name) ||
          !user.dataAuth.fullName ||
          !user.dataAuth.email ||
          !user.dataAuth.password ||
          !user.dataAuth.passwordConfirm
        ) {
          setErrorMessage("Заполните все поля");
          setErrorModal(true);
          setErrorValidation(false);
        } else if (
          user.errorAuth[0].errors[0] ||
          user.errorAuth[1].errors[0] ||
          user.errorAuth[2].errors[0] ||
          user.errorAuth[3].errors[0] ||
          user.errorAuth[4].errors[0]
        ) {
          setErrorMessage("Заполните все поля верно");
          setErrorModal(true);
        } else if (stages === 3) {
        } else {
          setErrorMessage("");
          setErrorModal(false);
          setErrorValidation(false);
          setStages(2);
        }
      })
      .catch((err) => {
				console.log(err);
				setErrorMessage(err.response.data.message);
        setErrorModal(true);
      });
  };

  const isErrorStage3 = async () => {
    const response = await checkCondidate(
      user.dataAuth.name,
      user.dataAuth.email
    )
      .then(() => {
        if (
          (stages === 1 && !user.dataAuth.name) ||
          !user.dataAuth.fullName ||
          !user.dataAuth.email ||
          !user.dataAuth.password ||
          !user.dataAuth.passwordConfirm
        ) {
          setErrorMessage("Заполните все поля");
          setErrorModal(true);
          setErrorValidation(false);
        } else if (
          user.errorAuth[0].errors[0] ||
          user.errorAuth[1].errors[0] ||
          user.errorAuth[2].errors[0] ||
          user.errorAuth[3].errors[0] ||
          user.errorAuth[4].errors[0]
        ) {
          setErrorMessage("Заполните все поля верно");
          setErrorModal(true);
        } else if (user.dataAuth.group === "Выберите группу") {
          setStages(2);
          setErrorMessage("Выберите группу");
          setErrorModal(true);
        } else {
          emailjs.send(
            "service_zv37r4m",
            "template_miaq7kl",
            sendParams,
            "hHtBfqHv7BnJpnld_"
          );
          setErrorMessage("");
          setErrorModal(false);
          setErrorValidation(false);
          setStages(3);
        }
      })
      .catch((err) => {
				console.log(err);
				setErrorMessage(err.response.data.message);
        setErrorModal(true);
      });
  };

	const isError = async () => {
		setLoading(true);
		if (
			stages === 1 &&
			(!user.dataAuth.name ||
				!user.dataAuth.fullName ||
				!user.dataAuth.email ||
				!user.dataAuth.password ||
				!user.dataAuth.passwordConfirm)
		) {
			setErrorMessage("Заполните все поля");
			setErrorModal(true);
			setLoading(false);
		} else if (
			user.errorAuth[0].errors[0] ||
			user.errorAuth[1].errors[0] ||
			user.errorAuth[2].errors[0] ||
			user.errorAuth[3].errors[0] ||
			user.errorAuth[4].errors[0]
		) {
			setErrorMessage("Заполните все поля верно");
			setErrorModal(true);
			setLoading(false);
		} else if (stages === 2 && user.dataAuth.group === "Выберите группу") {
			setErrorMessage("Выберите группу");
			setErrorModal(true);
			setLoading(false);
		} else {
			const response = await checkCondidate(
				user.dataAuth.name,
				user.dataAuth.email
			)
				.then(() => {
					setLoading(false);
					setErrorMessage("");
					setErrorModal(false);
					if (stages === 2) {
						generateCode(user.dataAuth.email, user.codeAuth).then();
						setStages((item) => item + 1);
					} else {
						setStages((item) => item + 1);
					}
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
		}
	};

	return (
		<div className="registration">
			<CSSTransition
				in={errorModal}
				timeout={0}
				classNames="node"
				unmountOnExit
			>
				<div className="registration__errors">
					<ModalError error={errorMessage} setErrorModal={setErrorModal} />
				</div>
			</CSSTransition>
			<CSSTransition
				in={completeModal}
				timeout={0}
				classNames="node"
				unmountOnExit
			>
				<div className="registration__complete">
					<ModalComplete
						completeMessage={completeMessage}
						setCompleteModal={setCompleteModal}
					/>
				</div>
			</CSSTransition>
			<Link to="/news" className="registration__back-page">
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
			<div className="registration__wrapper">
				<div className="registration__stages">
					<RegistrationStages
						stages={stages}
						setStages={setStages}
						setErrorMessage={setErrorMessage}
						setErrorModal={setErrorModal}
						onStage1={isErrorStage1}
						onStage2={isErrorStage2}
						onStage3={isErrorStage3}
						textStage1='Основная информация'
						textStage2='Дополнительная информация'
						textStage3='Завершение'
					/>
				</div>
				<SwitchTransition mode="out-in">
					<CSSTransition key={stages} timeout={300} classNames="node">
						<div className="registration__stage">
							{stages === 1 ? (
								<FirstStageReg stages={stages} />
							) : stages === 2 ? (
								<SecondStageReg setStages={setStages} errorModal={errorModal} />
							) : stages === 3 ? (
								<ThirdStageReg
									stages={stages}
									setErrorMessage={setErrorMessage}
									setErrorModal={setErrorModal}
									setCompleteModal={setCompleteModal}
									setCompleteMessage={setCompleteMessage}
								/>
							) : null}
						</div>
					</CSSTransition>
				</SwitchTransition>
				<CSSTransition
					nodeRef={nodeRef}
					in={stages < 3}
					timeout={300}
					classNames="buttonBye"
					unmountOnExit
				>
					<div ref={nodeRef} className="registration__bottom">
						<PrimaryButton
							onButton={isError}
							loading={loading}
						>
							Далее
						</PrimaryButton>
						<div className="registration__bottom-sign">
							<p className="registration__bottom-sign-text">
								Уже есть аккаунт?
							</p>
							<Link to="/login" className="registration__bottom-sign-link">
								Войти
							</Link>
						</div>
					</div>
				</CSSTransition>
			</div>
		</div>
	);
});

export default Registation;
