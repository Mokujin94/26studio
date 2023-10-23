import React, { useContext, useRef } from "react";

import style from "./primaryButton.module.scss";
import { Context } from "../..";
import { observer } from "mobx-react-lite";
import emailjs from "@emailjs/browser";
import { generateCode } from "../../http/userAPI";

const PrimaryButton = observer(({ children, stages, setStages }) => {
  const { user } = useContext(Context);

  const isError = () => {
    if (user.errorAuth === true) {
      alert("Заполните все поля верно!!!!!");
    } else if (stages === 2) {
      generateCode(user.dataAuth.email, user.codeAuth).then((data) =>
        console.log(data)
      );
      setStages((item) => item + 1);
    } else {
      setStages((item) => item + 1);
    }
  };

  return (
    <button type="submit" className={style.button} onClick={isError}>
      {children}
    </button>
  );
});

export default PrimaryButton;
