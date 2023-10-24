import React, { useContext, useRef, useState } from "react";

import style from "./primaryButton.module.scss";
import { Context } from "../..";
import { observer } from "mobx-react-lite";
import { checkCondidate, generateCode } from "../../http/userAPI";
import Spinner from "../spinner/Spinner";

const PrimaryButton = observer(
  ({ children, stages, setStages, setErrorMessage, setErrorModal }) => {
    const { user } = useContext(Context);

    const [loading, setLoading] = useState(false);

    const isError = async () => {
      setLoading(true);
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
        setLoading(false);
      } else if (
        user.errorAuth[0].errors[0] ||
        user.errorAuth[1].errors[0] ||
        user.errorAuth[2].errors[0] ||
        user.errorAuth[3].errors[0] ||
        user.errorAuth[4].errors[0]
      ) {
        setErrorMessage("Заполните все поля верно");
        setErrorModal(true);
        setLoading(false);
      } else if (stages === 2 && user.dataAuth.group === "Выберите группу") {
        setErrorMessage("Выберите группу");
        setErrorModal(true);
        setLoading(false);
      } else {
        const response = await checkCondidate(
          user.dataAuth.name,
          user.dataAuth.email
        )
          .then(() => {
            setLoading(false);
            setErrorMessage("");
            setErrorModal(false);
            if (stages === 2) {
              generateCode(user.dataAuth.email, user.codeAuth).then(
                console.log("Код успешно отправлен")
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
              setLoading(false);
            } else {
              setErrorMessage(err.message);
              setErrorModal(true);
            }
          });
      }
    };

    return (
      <button type="submit" className={style.button} onClick={isError}>
        {loading ? <Spinner /> : children}
      </button>
    );
  }
);

export default PrimaryButton;
