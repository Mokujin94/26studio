import React, { useState } from "react";
import RegistrationStages from "../../components/registrationStages/RegistrationStages";
import "./registration.scss";
import FirstStageReg from "../../components/firstStageReg/FirstStageReg";
import SecondStageReg from "../../components/secondStageReg/SecondStageReg";
function Registation() {
  const [stages, setStages] = useState(1);
  return (
    <div className="registration">
      <div className="registration__stages">
        <RegistrationStages stages={stages} />
      </div>
      <div className="registration__stage">
        {stages === 1 ? (
          <FirstStageReg setStages={setStages} />
        ) : stages === 2 ? (
          <SecondStageReg setStages={setStages} />
        ) : null}
        {/* <FirstStageReg setStages={setStages} />
        <SecondStageReg setStages={setStages} /> */}
      </div>
    </div>
  );
}

export default Registation;
