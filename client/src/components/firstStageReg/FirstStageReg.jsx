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

  const [newData, setNewData] = useState({});

  const [nameError, setNameError] = useState(false);
  const [fullNameError, setFullNameError] = useState(false);
  const [emailError, setEmailError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [passwordConfirmError, setPasswordConfirmError] = useState(false);


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
  }, [newData]);



  const validationName = (e) => {
    setValueName(e.target.value);
    let match = /^[а-яё]*$/i.test(e.target.value)
    if (e.target.value.length < 4 || match) {
      const newError = {
        id: 0,
        name: "Никнейм",
        errors: [
          {id: 1, name: "Никнейм должен содержать минимум 4 символа"},
          {id: 2, name: "Никнейм должен содержать минимум латинские буквы"}
        ]
      }
      user.setErrorAuth(user.errorAuth, newError);
      // console.log(user.errorAuth.map(item => {
      //   item.errors.map(twoItem => {
      //     return twoItem.name
      //   })
      // }))
      // console.log(user.errorAuth.forEach(item => {
      //   return item;

      // }))

      // for (let i = 0; i < user.errorAuth.length; i++) {
      //   for (let d = 0; d < user.errorAuth[i].errors.length; d++) {
      //    console.log(user.errorAuth[i].errors[d].name);

        
      //   }
      //   break
      // }

      user.errorAuth.forEach(item => {
        item.errors.forEach(twoItem => {
          console.log( twoItem.name)
        })
      })

      console.log(user.errorAuth)
      setNameError(true);
    } else {
      const newError = {
        id: 0,
        name: "Никнейм",
        errors: [
        ]
      }
      user.setErrorAuth(user.errorAuth, newError);
      setNameError(false);
    }
  };

  const validationFullName = (e) => {
    setValueFullName(e.target.value);
    let match = /^[а-яё]*$/i.test(e.target.value.replaceAll(' ', ''))
    let secondSpace = e.target.value.indexOf(' ', 1 + e.target.value.indexOf(' '));
    let firstWord = e.target.value.slice(0, e.target.value.indexOf(' ') === -1 ? e.target.value.length : e.target.value.indexOf(' ') + 1);
    let checkSpaceFristWord = firstWord.indexOf(' ');
    let secondWord = e.target.value.slice(firstWord.length, secondSpace === -1 ? e.target.value.length : secondSpace + 1);
    let checkSpaceSecondWord = secondWord.indexOf(' ');
    let thirdWord = e.target.value.slice(secondSpace === -1 ? e.target.value.length + 1 : secondSpace + 1, e.target.value.length);
    let checkSpaceThirdWord = thirdWord.indexOf(' ');

    if (firstWord.length < 2 || !match|| checkSpaceFristWord === 0 || checkSpaceFristWord === -1 || checkSpaceSecondWord === 0 || !secondWord || secondSpace !== -1 && !thirdWord || checkSpaceThirdWord !== -1 || thirdWord && checkSpaceSecondWord === -1) {
      const newError = {
        id: 1,
        name: "ФИО",
        errors: [
          {id: 0, name: "ФИО не должно содержать пробелы в начале или в конце"},
          {id: 1, name: "ФИО должно содержать только киррилицу"},
          {id: 2, name: "Фамилия и имя обязательны для заполнения"},
        ]
      }
      user.setErrorAuth(user.errorAuth, newError);
      // for (let i = 0; i < user.errorAuth.length; i++) {
      //   for (let d = 0; d < user.errorAuth[i].errors.length; d++) {
      //    console.log(user.errorAuth[i].errors[d].name);

        
      //   }
      //   break
      // }
      console.log(user.errorAuth)

      setFullNameError(true);
    } else {
      const newError = {
        id: 2,
        name: "ФИО",
        errors: [
        ]
      }
      user.setErrorAuth(user.errorAuth, newError);
      
      setFullNameError(false);
    }
  };

  

  const validationMail = (e) => {
    setValueMail(e.target.value);

  };

  const validationPassword = (e) => {
    setValuePassword(e.target.value);

  };

  const validationPasswordConfirm = (e) => {
    setValuePasswordConfirm(e.target.value);
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
                style={nameError ? {border: "2px solid red"} : null}
              />
            </label>
            <label className={style.first__item}>
              <h3 className={style.first__itemTitle}>ФИО</h3>
              <input
                value={valueFullName}
                onChange={validationFullName}
                type="text"
                className={style.first__itemInput}
                style={fullNameError ? {border: "2px solid red"} : null}
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
