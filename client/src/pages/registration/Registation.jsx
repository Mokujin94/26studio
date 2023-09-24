import React, { useState } from 'react';
import RegistrationStages from '../../components/registrationStages/RegistrationStages';
import './registration.scss';
import FirstStageReg from '../../components/firstStageReg/FirstStageReg';
function Registation() {
  const [stages, setStages] = useState(1);
  return (
    <div className="registration">
      <RegistrationStages stages={stages} />
      <div className="registration__stage">
        <FirstStageReg setStages={setStages} />
      </div>
    </div>
  );
}

export default Registation;
