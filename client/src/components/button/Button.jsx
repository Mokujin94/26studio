import React from "react";

import style from "./button.module.scss";

function Button({ children }) {
  return (
    <button className={style.button}>
      {children}
    </button>
  );
}

export default Button;
