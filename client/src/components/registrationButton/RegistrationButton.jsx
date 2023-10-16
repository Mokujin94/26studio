import React, { useContext, useRef } from "react";

import style from "./registrationButton.module.scss";
import { Context } from "../..";
import { observer } from "mobx-react-lite";
import emailjs from "@emailjs/browser";
import { checkCondidate } from "../../http/userAPI";

const RegistrationButton = observer(({ children, stages, setStages }) => {
  const { user } = useContext(Context);

  const sendParams = {
    email_to: user.dataAuth.email,
    code: user.codeAuth,
  };

  const isError = async () => {
    const response = await checkCondidate(
      user.dataAuth.name,
      user.dataAuth.email
    )
      .then(() => {
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
        return err;
      });
  };

  return (
    <button type="submit" className={style.button} onClick={isError}>
      {children}
    </button>
  );
});

export default RegistrationButton;
