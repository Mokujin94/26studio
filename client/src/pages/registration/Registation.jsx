import React, { useState } from "react";
import RegistrationStages from "../../components/registrationStages/RegistrationStages";
import "./registration.scss";
function Registation() {
  const [stages, setStages] = useState(1);
  return (
    <div className="registration">
      <RegistrationStages stages={stages} />
      <button onClick={() => setStages((item) => item + 1)}>sdfsdf</button>
    </div>
  );
}

export default Registation;
