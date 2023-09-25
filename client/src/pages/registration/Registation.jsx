import React, { useState } from "react";
import RegistrationStages from "../../components/registrationStages/RegistrationStages";
import "./registration.scss";
import FirstStageReg from "../../components/firstStageReg/FirstStageReg";
import ThirdStageReg from "../../components/thirdStageReg/ThirdStageReg";
function Registation() {
  const [stages, setStages] = useState(1);
  return (
    <div className="registration">
      <div className="registration__stages">
        <RegistrationStages stages={stages} />
      </div>
      <div className="registration__stage">
        {/* <FirstStageReg setStages={setStages} /> */}
        <ThirdStageReg setStages={setStages} />
      </div>
    </div>
  );
}

export default Registation;
