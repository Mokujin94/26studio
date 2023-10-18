import React, { useContext, useState } from 'react';

import { Link, useNavigate } from 'react-router-dom';

import FunctionButton from '../../components/functionButton/FunctionButton';
import { Context } from '../..';
import { login } from '../../http/userAPI';
import { NEWS_ROUTE } from '../../utils/consts';

function Auth() {
  const { user } = useContext(Context);
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const navigate = useNavigate();
  const onLogin = async (e) => {
    e.preventDefault();
    await login(email, password).then((data) => {
      user.setUser(data);
      user.setAuth(true);
      navigate(NEWS_ROUTE);
    });
  };
  return (
    <div className="auth">
      <h1 className="auth__title">Вход</h1>
      <form className="auth__form">
        <div className="auth__input">
          <h2 className="auth__input-title">Почта</h2>
          <input onChange={(e) => setEmail(e.target.value)} type="email" className="auth__input-item" />
        </div>
        <div className="auth__input">
          <h2 className="auth__input-title">Пароль</h2>
          <input onChange={(e) => setPassword(e.target.value)} type="password" className="auth__input-item" />
        </div>
        <Link to="/" className="auth__forget">
          Забыли пароль?
        </Link>
        <FunctionButton onClick={onLogin}>Войти</FunctionButton>
        <div className="auth__notAuth">
          <p className="auth__notAuthText">Нет аккаунта?</p>
          <Link to="/registration" className="auth__notAuthLink">
            Зарегистрироваться
          </Link>
        </div>
      </form>
    </div>
  );
}

export default Auth;
