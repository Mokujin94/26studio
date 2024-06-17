import React, { useContext } from "react";
import { Link } from "react-router-dom";

import style from "./mainButton.module.scss";
import { Context } from "../..";
import { observer } from "mobx-react-lite";

const MainButton = observer(({ path, title, onClick }) => {
  const { user } = useContext(Context);

  const onEffect = () => {
    if (onClick) {
      onClick();
    }
    user.setBurgerActive(false);
  };

  return (
    <div className={style.btn} onClick={onEffect}>
      <Link to={path} className={style.btnText}>
        {title}
      </Link>
    </div>
  );
});

export default MainButton;
