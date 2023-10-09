import React, { useContext } from "react";

import style from "./registrationButton.module.scss";
import { Context } from "../..";
import { observer } from "mobx-react-lite";
import emailjs from "@emailjs/browser";

const RegistrationButton = observer(({ children, stages, setStages }) => {
  const { user } = useContext(Context);

  const isError = () => {
    if (user.errorAuth === true) {
      alert("Заполните все поля верно!!!!!");
    } else {
      setStages((item) => item + 1);
    }
  };

  const sendData = (e) => {
    e.preventDefault();

    if (stages == 3) {
      emailjs.sendForm(
        "service_zv37r4m",
        "template_miaq7kl",
        e.target,
        "hHtBfqHv7BnJpnld_"
      );
    }
  };
  return (
    <form onSubmit={sendData}>
      <input type="hidden" name="code" value={user.codeAuth} />
      <input type="hidden" name="email_to" value={user.dataAuth.email} />
      <button type="submit" className={style.button} onClick={isError}>
        {children}
      </button>
    </form>
  );
});

export default RegistrationButton;
