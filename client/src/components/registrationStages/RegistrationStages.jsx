import React, { useContext, useState } from "react";

import style from "./registrationStages.module.scss";
import { Context } from "../..";
import { checkCondidate } from "../../http/userAPI";
import emailjs from "@emailjs/browser";

function RegistrationStages({
  stages,
  setStages,
  setErrorMessage,
  setErrorModal,
}) {
  const { user } = useContext(Context);
  const [errorValidation, setErrorValidation] = useState(false);

  const sendParams = {
    email_to: user.dataAuth.email,
    code: user.codeAuth,
  };

  const isErrorStage1 = async () => {
    if (stages === 3) {
    } else {
      setStages(1);
    }
  };

  const isErrorStage2 = async () => {
    const response = await checkCondidate(
      user.dataAuth.name,
      user.dataAuth.email
    )
      .then(() => {
        if (
          (stages === 1 && !user.dataAuth.name) ||
          !user.dataAuth.fullName ||
          !user.dataAuth.email ||
          !user.dataAuth.password ||
          !user.dataAuth.passwordConfirm
        ) {
          setErrorMessage("Заполните все поля");
          setErrorModal(true);
          setErrorValidation(false);
        } else if (
          user.errorAuth[0].errors[0] ||
          user.errorAuth[1].errors[0] ||
          user.errorAuth[2].errors[0] ||
          user.errorAuth[3].errors[0] ||
          user.errorAuth[4].errors[0]
        ) {
          setErrorMessage("Заполните все поля верно");
          setErrorModal(true);
        } else if (stages === 3) {
        } else {
          setErrorMessage("");
          setErrorModal(false);
          setErrorValidation(false);
          setStages(2);
        }
      })
      .catch((err) => {
        setErrorMessage(err.response.data.message);
        setErrorModal(true);
      });
  };

  const isErrorStage3 = async () => {
    const response = await checkCondidate(
      user.dataAuth.name,
      user.dataAuth.email
    )
      .then(() => {
        if (
          (stages === 1 && !user.dataAuth.name) ||
          !user.dataAuth.fullName ||
          !user.dataAuth.email ||
          !user.dataAuth.password ||
          !user.dataAuth.passwordConfirm
        ) {
          setErrorMessage("Заполните все поля");
          setErrorModal(true);
          setErrorValidation(false);
        } else if (
          user.errorAuth[0].errors[0] ||
          user.errorAuth[1].errors[0] ||
          user.errorAuth[2].errors[0] ||
          user.errorAuth[3].errors[0] ||
          user.errorAuth[4].errors[0]
        ) {
          setErrorMessage("Заполните все поля верно");
          setErrorModal(true);
        } else if (user.dataAuth.group === "Выберите группу") {
          setStages(2);
          setErrorMessage("Выберите группу");
          setErrorModal(true);
        } else {
          emailjs.send(
            "service_zv37r4m",
            "template_miaq7kl",
            sendParams,
            "hHtBfqHv7BnJpnld_"
          );
          setErrorMessage("");
          setErrorModal(false);
          setErrorValidation(false);
          setStages(3);
        }
      })
      .catch((err) => {
        setErrorMessage(err.response.data.message);
        setErrorModal(true);
      });
  };

  return (
    <div className={style.stages}>
      <div className={style.stages__item} onClick={isErrorStage1}>
        <div
          className={`${style.stages__itemNum} ${style.stages__itemNum_active}`}
        >
          1
        </div>
        <span className={style.stages__itemText}>Основная информация</span>
      </div>
      <span
        className={`${
          stages > 1
            ? style.stages__line + " " + style.stages__line_active
            : style.stages__line
        }`}
      ></span>
      <div className={style.stages__item} onClick={isErrorStage2}>
        <div
          className={`${
            stages > 1
              ? style.stages__itemNum + " " + style.stages__itemNum_active
              : style.stages__itemNum
          }`}
        >
          2
        </div>
        <span className={style.stages__itemText}>
          Дополнительная информация
        </span>
      </div>
      <span
        className={`${
          stages > 2
            ? style.stages__line + " " + style.stages__line_active
            : style.stages__line
        }`}
      ></span>
      <div className={style.stages__item} onClick={isErrorStage3}>
        <div
          className={`${
            stages > 2
              ? style.stages__itemNum + " " + style.stages__itemNum_active
              : style.stages__itemNum
          }`}
        >
          3
        </div>
        <span className={style.stages__itemText}>Завершение</span>
      </div>
    </div>
  );
}

export default RegistrationStages;
