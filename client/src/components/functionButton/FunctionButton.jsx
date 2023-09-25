import React from "react";

import style from "./functionButton.module.scss";

function FunctionButton({ children }) {
  return <button className={style.button}>{children}</button>;
}

export default FunctionButton;
