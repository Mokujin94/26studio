import React, { useContext, useRef, useState } from "react";
import { Link } from "react-router-dom";
import RegistrationStages from "../../components/registrationStages/RegistrationStages";
import FirstStageReg from "../../components/firstStageReg/FirstStageReg";
import SecondStageReg from "../../components/secondStageReg/SecondStageReg";
import ThirdStageReg from "../../components/thirdStageReg/ThirdStageReg";
import PrimaryButton from "../../components/primaryButton/PrimaryButton";

import "./registration.scss";

import { CSSTransition, SwitchTransition } from "react-transition-group";
import { observer } from "mobx-react-lite";

const Registation = observer(() => {
  const [stages, setStages] = useState(1);
  const nodeRef = useRef(null);

  return (
    <div className="registration">
      <div className="registration__wrapper">
        <div className="registration__stages">
          <RegistrationStages stages={stages} setStages={setStages} />
        </div>
        <SwitchTransition mode="out-in">
          <CSSTransition key={stages} in={stages} timeout={300} classNames="node">
            <div className="registration__stage">
              {stages === 1 ? (
                <FirstStageReg stages={stages} />
              ) : stages === 2 ? (
                <SecondStageReg setStages={setStages} />
              ) : stages === 3 ? (
                <ThirdStageReg stages={stages} />
              ) : null}
            </div>
          </CSSTransition>
        </SwitchTransition>
        <CSSTransition
          nodeRef={nodeRef}
          in={stages < 3 ? true : false}
          timeout={300}
          classNames="buttonBye"
          unmountOnExit
        >
          <div ref={nodeRef} className="registration__bottom">
            <PrimaryButton stages={stages} setStages={setStages}>
              Далее
            </PrimaryButton>
            <div className="registration__bottom-sign">
              <p className="registration__bottom-sign-text">Уже есть аккаунт?</p>
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
