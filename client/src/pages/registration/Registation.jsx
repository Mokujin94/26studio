import React, { useRef, useState } from "react";
import { Link } from "react-router-dom";
import RegistrationStages from "../../components/registrationStages/RegistrationStages";
import FirstStageReg from "../../components/firstStageReg/FirstStageReg";
import SecondStageReg from "../../components/secondStageReg/SecondStageReg";
import ThirdStageReg from "../../components/thirdStageReg/ThirdStageReg";
import RegistrationButton from "../../components/registrationButton/RegistrationButton";

import "./registration.scss";

import {
  CSSTransition,
  SwitchTransition,
  TransitionGroup,
} from "react-transition-group";

function Registation() {
  const [stages, setStages] = useState(1);
  const nodeRef = useRef(null);

  return (
    <div className="registration">
      <div className="registration__wrapper">
        <div className="registration__stages">
          <RegistrationStages stages={stages} setStages={setStages} />
        </div>
        <SwitchTransition mode="out-in">
          <CSSTransition
            key={stages}
            in={stages}
            timeout={300}
            classNames="node"
          >
            <div className="registration__stage">
              {stages === 1 ? (
                <FirstStageReg setStages={setStages} />
              ) : stages === 2 ? (
                <SecondStageReg setStages={setStages} />
              ) : stages === 3 ? (
                <ThirdStageReg stages={stages} />
              ) : null}
            </div>
          </CSSTransition>
        </SwitchTransition>

        {/* <SwitchTransition mode="out-in"> */}
        <CSSTransition
          nodeRef={nodeRef}
          // key={stages}
          in={stages < 3 ? true : false}
          timeout={300}
          classNames="buttonBye"
          unmountOnExit
          // mountOnEnter
        >
          <div ref={nodeRef} className="registration__bottom">
            <RegistrationButton setStages={setStages}>Далее</RegistrationButton>
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
        {/* </SwitchTransition> */}
      </div>
    </div>
  );
}

export default Registation;
