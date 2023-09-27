import React, { useRef, useState } from "react";
import RegistrationStages from "../../components/registrationStages/RegistrationStages";
import FirstStageReg from "../../components/firstStageReg/FirstStageReg";
import SecondStageReg from "../../components/secondStageReg/SecondStageReg";
import ThirdStageReg from "../../components/thirdStageReg/ThirdStageReg";
import RegistrationButton from "../../components/registrationButton/RegistrationButton";

import "./registration.scss";

import { CSSTransition, SwitchTransition, TransitionGroup } from "react-transition-group";

function Registation() {
  const [stages, setStages] = useState(1);
  const [click, setClick] = useState(false);
  const nodeRef = useRef(null);

  return (
    <div className="registration">
      <div className="registration__stages">
        <RegistrationStages stages={stages} />
      </div>
      <SwitchTransition mode="out-in">
        <CSSTransition key={stages} in={click} timeout={300} classNames="node">
          <div className="registration__stage">
            {stages === 1 ? (
              <FirstStageReg setStages={setStages} setClick={setClick} />
            ) : stages === 2 ? (
              <SecondStageReg setStages={setStages} setClick={setClick} />
            ) : stages === 3 ? (
              <ThirdStageReg />
            ) : null}
          </div>
        </CSSTransition>
      </SwitchTransition>

      <div className="registration__bottom">
        {stages === 1 ? (
          <>
            <RegistrationButton setClick={setClick} setStages={setStages}>
              Далее
            </RegistrationButton>
            <p className="registration__bottom-notAuth">Уже есть аккаунт?</p>
          </>
        ) : stages === 2 ? (
          <RegistrationButton setClick={setClick} setStages={setStages}>
            Далее
          </RegistrationButton>
        ) : null}
      </div>

      {/* <button onClick={() => setClick(!click)}>Click</button> */}
    </div>
  );
}

export default Registation;
