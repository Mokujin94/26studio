import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";

import style from "./firstStageReg.module.scss";

import eye from "../../resource/graphics/icons/registration/regEye.svg";
import RegistrationButton from "../registrationButton/RegistrationButton";
import { Context } from "../..";
import { observer } from "mobx-react-lite";
const FirstStageReg = observer(({ stages }) => {
  const { user } = useContext(Context);

  const [valueName, setValueName] = useState(user.dataAuth.name);
  const [valueFullName, setValueFullName] = useState(user.dataAuth.fullName);
  const [valueMail, setValueMail] = useState(user.dataAuth.email);
  const [valuePassword, setValuePassword] = useState(user.dataAuth.password);
  const [valuePasswordConfirm, setValuePasswordConfirm] = useState(
    user.dataAuth.passwordConfirm
  );

  const [nameError, setNameError] = useState(false);
  const [fullNameError, setFullNameError] = useState(false);
  const [mailError, setMailError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [passwordConfirmError, setPasswordConfirmError] = useState(false);

  const [newData, setNewData] = useState({});

  useEffect(() => {
    setNewData({
      name: valueName,
      fullName: valueFullName,
      email: valueMail,
      password: valuePassword,
      passwordConfirm: valuePasswordConfirm,
    });
  }, [
    valueName,
    valueFullName,
    valueMail,
    valuePassword,
    valuePasswordConfirm,
  ]);

  useEffect(() => {
    user.setDataAuth({ ...user.dataAuth, ...newData });
  }, [
    valueName,
    valueFullName,
    valueMail,
    valuePassword,
    valuePasswordConfirm,
    newData,
  ]);

  useEffect(() => {
    if (
      nameError ||
      fullNameError ||
      mailError ||
      passwordError ||
      passwordConfirmError ||
      !valueName ||
      !valueFullName ||
      !valueMail ||
      !valuePassword ||
      !valuePasswordConfirm
    ) {
      user.setErrorAuth(true);
    } else {
      user.setErrorAuth(false);
    }
  }, [
    nameError,
    fullNameError,
    mailError,
    passwordError,
    passwordConfirmError,
    valueName,
    valueFullName,
    valueMail,
    valuePassword,
    valuePasswordConfirm,
  ]);

  const validationName = (e) => {
    setValueName(e.target.value);
    if (e.target.value.length < 4) {
          user.setErrorAuth("Никнейм должен содержать не менее 4 символов");
      console.log(user.errorAuth);
    } else if (/[а-яё]+/i.test(e.target.value)) {
      user.setErrorAuth([...user.errorAuth, [{name: "Никнейм должен быть написан на латинице"}]])
      console.log(user.errorAuth);
    }
     else {

    }
  };

  const validationFullName = (e) => {
    console.log(user.dataAuth);
    setValueFullName(e.target.value);
    if (
      e.target.value.length < 5 ||
      e.target.value[0] === " " ||
      e.target.value[e.target.value.length - 1] == " " ||
      !/[а-яё]+/i.test(e.target.value)
    ) {
      setFullNameError(true);
    } else {
      setFullNameError(false);
    }
  };

  

  const validationMail = (e) => {
    setValueMail(e.target.value);
    let checkBeforeMail = e.target.value.slice(0, e.target.value.indexOf("@"))
    let checkDot = e.target.value.slice(e.target.value.indexOf("@") + 2, e.target.value.length);
    let checkDomen = checkDot.slice(checkDot.indexOf('.') + 1, checkDot.length);
    console.log(checkBeforeMail)
    if ( e.target.value.indexOf("@") == -1 || e.target.value.indexOf(".") == -1 || checkDot.indexOf('.') == -1 || checkDomen.length < 2 || !checkBeforeMail) {
      setMailError(true);
    } else {
      setMailError(false);
    }
  };

  const validationPassword = (e) => {
    setValuePassword(e.target.value);
    if (e.target.value.length < 6) {
      setPasswordError(true);
    } else {
      setPasswordError(false);
    }
  };

  const validationPasswordConfirm = (e) => {
    setValuePasswordConfirm(e.target.value);
    if (e.target.value !== valuePassword) {
      setPasswordConfirmError(true);
    } else {
      setPasswordConfirmError(false);
    }
  };
  return (
    <>
      <div className={style.first}>
        <div className={style.first__inner}>
          <div className={style.first__row}>
            <label className={style.first__item}>
              <h3 className={style.first__itemTitle}>Никнейм</h3>
              <input
                value={valueName}
                onChange={validationName}
                type="text"
                required
                className={style.first__itemInput}
              />
            </label>
            <label className={style.first__item}>
              <h3 className={style.first__itemTitle}>ФИО</h3>
              <input
                value={valueFullName}
                onChange={validationFullName}
                type="text"
                className={style.first__itemInput}
              />
            </label>
          </div>
          <label className={`${style.first__item} ${style.first__itemEmail}`}>
            <h3 className={style.first__itemTitle}>Почта</h3>
            <input
              value={valueMail}
              onChange={validationMail}
              type="email"
              className={style.first__itemInput}
            />
          </label>
          <div className={style.first__row}>
            <label className={style.first__item}>
              <h3 className={style.first__itemTitle}>Пароль</h3>
              <div className={style.first__itemBottom}>
                <input
                  value={valuePassword}
                  onChange={validationPassword}
                  type="password"
                  className={`${style.first__itemInput} ${style.first__itemInputPass}`}
                />
                <img src={eye} alt="" />
              </div>
            </label>
            <label className={style.first__item}>
              <h3 className={style.first__itemTitle}>Повтор пароля</h3>
              <div className={style.first__itemBottom}>
                <input
                  value={valuePasswordConfirm}
                  onChange={validationPasswordConfirm}
                  type="password"
                  className={`${style.first__itemInput} ${style.first__itemInputPass}`}

                />
                <img src={eye} alt="" />
              </div>
            </label>
          </div>
        </div>
      </div>
    </>
  );
});

export default FirstStageReg;
