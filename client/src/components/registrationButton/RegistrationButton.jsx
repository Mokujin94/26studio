import React, { useContext, useRef } from "react";

import style from "./registrationButton.module.scss";
import { Context } from "../..";
import { observer } from "mobx-react-lite";
import emailjs from "@emailjs/browser";
import { checkCondidate } from "../../http/userAPI";

const RegistrationButton = observer(
  ({ children, stages, setStages, setErrorMessage, setErrorModal }) => {
    const { user } = useContext(Context);

    const sendParams = {
      email_to: user.dataAuth.email,
      code: user.codeAuth,
    };

    const isError = async () => {
      if (
        stages === 1 &&
        (!user.dataAuth.name ||
          !user.dataAuth.fullName ||
          !user.dataAuth.email ||
          !user.dataAuth.password ||
          !user.dataAuth.passwordConfirm)
      ) {
        setErrorMessage("Заполните все поля");
        setErrorModal(true);
      } else if (
        user.errorAuth[0].errors[0] ||
        user.errorAuth[1].errors[0] ||
        user.errorAuth[2].errors[0] ||
        user.errorAuth[3].errors[0] ||
        user.errorAuth[4].errors[0]
      ) {
        setErrorMessage("Заполните все поля верно");
        setErrorModal(true);
      } else if (stages === 2 && user.dataAuth.group === "Выберите группу") {
        setErrorMessage("Выберите группу");
        setErrorModal(true);
      } else {
        const response = await checkCondidate(
          user.dataAuth.name,
          user.dataAuth.email
        )
          .then(() => {
            setErrorMessage("");
            setErrorModal(false);
            if (stages === 2) {
              emailjs.send(
                "service_zv37r4m",
                "template_miaq7kl",
                sendParams,
                "hHtBfqHv7BnJpnld_"
              );

              setStages((item) => item + 1);
            } else {
              setStages((item) => item + 1);
            }
          })
          .catch((err) => {
            if (err.response) {
              setErrorMessage(err.response.data.message);
              setErrorModal(true);
            } else {
              setErrorMessage(err.message);
              setErrorModal(true);
            }
          });
      }
    };

    return (
      <button type="submit" className={style.button} onClick={isError}>
        {children}
      </button>
    );
  }
);

export default RegistrationButton;
