import React from "react";

import style from "./registrationButton.module.scss";

function RegistrationButton({ children, setStages, setClick }) {
  const func = () => {
    setStages((item) => item + 1);
    setClick((item) => !item);
  };
  return (
    <button className={style.button} onClick={() => func()}>
      {children}
    </button>
  );
}

export default RegistrationButton;
