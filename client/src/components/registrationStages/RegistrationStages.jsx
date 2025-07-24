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
	onStage1,
	onStage2,
	onStage3,
	textStage1,
	textStage2,
	textStage3
}) {
  const { user } = useContext(Context);

  return (
    <div className={style.stages}>
      <div className={style.stages__item} onClick={onStage1}>
        <div
          className={`${style.stages__itemNum} ${style.stages__itemNum_active}`}
        >
          1
        </div>
        <span className={style.stages__itemText}>{textStage1}</span>
      </div>
      <span
        className={`${
          stages > 1
            ? style.stages__line + " " + style.stages__line_active
            : style.stages__line
        }`}
      ></span>
      <div className={style.stages__item} onClick={onStage2}>
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
				{textStage2}
        </span>
      </div>
      <span
        className={`${
          stages > 2
            ? style.stages__line + " " + style.stages__line_active
            : style.stages__line
        }`}
      ></span>
      <div className={style.stages__item} onClick={onStage3}>
        <div
          className={`${
            stages > 2
              ? style.stages__itemNum + " " + style.stages__itemNum_active
              : style.stages__itemNum
          }`}
        >
          3
        </div>
        <span className={style.stages__itemText}>{textStage3}</span>
      </div>
    </div>
  );
}

export default RegistrationStages;
