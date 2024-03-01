import React, { useContext, useRef, useState } from "react";

import style from "./primaryButton.module.scss";
import { Context } from "../..";
import { observer } from "mobx-react-lite";
import { checkCondidate, generateCode } from "../../http/userAPI";
import Spinner from "../spinner/Spinner";

const PrimaryButton = observer(
  ({ children, onButton, loading }) => {

    return (
      <button type="submit" className={style.button} onClick={onButton}>
        {loading ? <Spinner /> : children}
      </button>
    );
  }
);

export default PrimaryButton;
