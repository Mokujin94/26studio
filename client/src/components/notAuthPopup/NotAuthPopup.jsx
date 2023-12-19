import React from "react";
import { Link } from "react-router-dom";
import { LOGIN_ROUTE, REGISTRATION_ROUTE } from "../../utils/consts";

import style from "./notAuthPopup.module.scss";

function NotAuthPopup() {
  return (
    <div className={style.block}>
      <h2 className={style.block__title}>Вы не авторизованны</h2>
      <div className={style.block__wrapper}>
        <Link className={style.btn} to={REGISTRATION_ROUTE}>
          Зарегистрироваться
        </Link>
        <Link className={style.btn} to={LOGIN_ROUTE}>
          Войти
        </Link>
      </div>
    </div>
  );
}

export default NotAuthPopup;
