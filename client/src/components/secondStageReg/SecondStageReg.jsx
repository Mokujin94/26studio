import React, { useContext, useEffect, useState } from "react";

import style from "./secondStageReg.module.scss";

import RegistrationButton from "../registrationButton/RegistrationButton";
import { Context } from "../..";
import { observer } from "mobx-react-lite";

const SecondStageReg = observer(({ setStages, setClick }) => {
  const { user } = useContext(Context);
  const [groupValue, setGroupValue] = useState(user.dataAuth.group);

  const [newData, setNewData] = useState({});

  useEffect(() => {
    setNewData({
      group: groupValue,
    });
    user.setDataAuth({ ...user.dataAuth, ...newData });
  }, [groupValue, newData]);

  const chengeSelect = (e) => {
    setGroupValue(e.target.value);
  };

  useEffect(() => {
    if (groupValue == "Выберите группу") {
      user.setErrorAuth(true);
    } else user.setErrorAuth(false);
  }, [groupValue]);

  return (
    <div className={style.second}>
      <div className={style.second__inner}>
        <div className={style.second__row}>
          <label className={style.second__item}>
            <h2 className={style.second__itemTitle}>Группа</h2>
            <select value={groupValue} onChange={chengeSelect} className={style.second__itemGroup}>
              <option className={style.second__itemGroupValue} selected disabled value="Выберите группу">
                Выберите группу
              </option>
              <option className={style.second__itemGroupValue} value="11/9">
                ИС 11/9
              </option>
              <option className={style.second__itemGroupValue} value="12/9">
                ИС 12/9
              </option>
              <option className={style.second__itemGroupValue} value="13/9">
                ИС 13/9
              </option>
              <option className={style.second__itemGroupValue} value="21/9">
                ИС 21/9
              </option>
              <option className={style.second__itemGroupValue} value="22/9">
                ИС 22/9
              </option>
              <option className={style.second__itemGroupValue} value="23/9">
                ИС 23/9
              </option>
              <option className={style.second__itemGroupValue} value="31/9">
                ИС 31/9
              </option>
              <option className={style.second__itemGroupValue} value="32/9">
                ИС 32/9
              </option>
              <option className={style.second__itemGroupValue} value="33/9">
                ИС 33/9
              </option>
              <option className={style.second__itemGroupValue} value="41/9">
                ИС 41/9
              </option>
              <option className={style.second__itemGroupValue} value="42/9">
                ИС 42/9
              </option>
              <option className={style.second__itemGroupValue} value="43/9">
                ИС 43/9
              </option>
            </select>
          </label>
          <label className={style.second__item}>
            <h2 className={style.second__itemTitle}>Аватар</h2>
            <button className={style.second__itemBtn}>Загрузить</button>
          </label>
        </div>
        <div className={style.second__row}>
          <label>
            <h2 className={style.second__itemTitle}>Немного информации о себе</h2>
            <textarea className={`${style.second__itemInput} ${style.second__itemInputArea}`} />
          </label>
        </div>
      </div>
    </div>
  );
});

export default SecondStageReg;
