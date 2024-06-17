import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { LOGIN_ROUTE, REGISTRATION_ROUTE } from "../../utils/consts";

import style from "./notAuthPopup.module.scss";
import PrimaryButton from "../primaryButton/PrimaryButton";
import MainButton from "../mainButton/MainButton";
import { observer } from "mobx-react-lite";
import { Context } from "../..";

const NotAuthPopup = observer(() => {
  const { error } = useContext(Context)
  
  const onClick = () => {
    error.setNotAuthError(false)
  }

  return (
    <div className={style.block} onClick={(e) => e.stopPropagation()}>
      <h2 className={style.block__title}>Вы не авторизованны</h2>
      <div className={style.block__wrapper}>
        <MainButton path={REGISTRATION_ROUTE} title={"Зарегистрироваться"} onClick={() => onClick()}/>
        <MainButton path={LOGIN_ROUTE} title={"Войти"} onClick={() => onClick()}/>
      </div>
    </div>
  );
})

export default NotAuthPopup;
