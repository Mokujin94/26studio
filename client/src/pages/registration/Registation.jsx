import React, { useContext, useRef, useState } from "react";
import { Link } from "react-router-dom";
import RegistrationStages from "../../components/registrationStages/RegistrationStages";
import FirstStageReg from "../../components/firstStageReg/FirstStageReg";
import SecondStageReg from "../../components/secondStageReg/SecondStageReg";
import ThirdStageReg from "../../components/thirdStageReg/ThirdStageReg";
import RegistrationButton from "../../components/registrationButton/RegistrationButton";

import "./registration.scss";

import { CSSTransition, SwitchTransition } from "react-transition-group";
import { observer } from "mobx-react-lite";
import ModalError from "../../components/modalError/ModalError";
import ModalComplete from "../../components/modalComplete/ModalComplete";

const Registation = observer(() => {
  const [stages, setStages] = useState(1);
  const [errorMessage, setErrorMessage] = useState("");
  const [errorModal, setErrorModal] = useState(false);
  const [completeMessage, setCompleteMessage] = useState("");
  const [completeModal, setCompleteModal] = useState(false);
  const nodeRef = useRef(null);

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
      <div className="registration__wrapper">
        <div className="registration__stages">
          <RegistrationStages
            stages={stages}
            setStages={setStages}
            setErrorMessage={setErrorMessage}
            setErrorModal={setErrorModal}
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
            <RegistrationButton
              stages={stages}
              setStages={setStages}
              setErrorMessage={setErrorMessage}
              setErrorModal={setErrorModal}
            >
              Далее
            </RegistrationButton>
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
