import React, { useContext } from "react";

import style from "./registrationButton.module.scss";
import { Context } from "../..";
import { observer } from "mobx-react-lite";

const RegistrationButton = observer(({ children, setStages }) => {
  const { user } = useContext(Context);

  const isError = () => {
    if (user.errorAuth === true) {
      alert("Заполните все поля верно!!!!!");
    } else {
      setStages((item) => item + 1);
    }
  };
  return (
    <button className={style.button} onClick={isError}>
      {children}
    </button>
  );
});

export default RegistrationButton;
