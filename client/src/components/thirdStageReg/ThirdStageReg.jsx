import React, { createRef, useState } from "react";

import style from "./thirdStageReg.module.scss";
import RegistrationButton from "../registrationButton/RegistrationButton";

function ThirdStageReg({ setStages }) {
  const [number1, setNumber1] = useState("");
  const [number2, setNumber2] = useState("");
  const [number3, setNumber3] = useState("");
  const [number4, setNumber4] = useState("");
  const [number5, setNumber5] = useState("");
  const [number6, setNumber6] = useState("");

  const input1 = createRef();
  const input2 = createRef();
  const input3 = createRef();
  const input4 = createRef();
  const input5 = createRef();
  const input6 = createRef();

  const onChange = (e) => {
    const id = e.target.attributes.id.value;
    if (e.target.value.length <= 1 && /\d+/.test(Number(e.target.value))) {
      if (id === "1") {
        setNumber1(e.target.value);
        if (!e.target.value) return input1.current.focus();
        input2.current.focus();
      } else if (id === "2") {
        setNumber2(e.target.value);
        if (!e.target.value) return input1.current.focus();
        input3.current.focus();
      } else if (id === "3") {
        setNumber3(e.target.value);
        if (!e.target.value) return input2.current.focus();
        input4.current.focus();
      } else if (id === "4") {
        setNumber4(e.target.value);
        if (!e.target.value) return input3.current.focus();
        input5.current.focus();
      } else if (id === "5") {
        setNumber5(e.target.value);
        if (!e.target.value) return input4.current.focus();
        input6.current.focus();
      } else if (id === "6") {
        setNumber6(e.target.value);
        if (!e.target.value) return input5.current.focus();
      }
    }
  };

  const onDeleteBox = (e) => {
    const id = e.target.attributes.id.value;
    if (e.keyCode === 8 && !e.target.value) {
      if (id === "1") {
      } else if (id === "2") {
        input1.current.focus();
      } else if (id === "3") {
        input2.current.focus();
      } else if (id === "4") {
        input3.current.focus();
      } else if (id === "5") {
        input4.current.focus();
      } else if (id === "6") {
        input5.current.focus();
      }
    }

    let nextId = Number(id) + 1;
    if (
      e.target.value.length >= 1 &&
      nextId <= 6 &&
      /\d+/.test(Number(e.key))
    ) {
      eval(`input${nextId}.current.focus()`);
      eval(`setNumber${nextId}(e.key)`);
    }
  };

  // const lastChar = (e) => {
  //   const id = e.target.attributes.id.value;
  //   let nextId = Number(id) + 1;
  //   if (e.target.value.length >= 1) {
  //     eval(`input${nextId}.current.focus()`);
  //     eval(`setNumber${nextId}(e.key)`);
  //   }
  // };

  return (
    <div className={style.third}>
      <h3 className={style.third__title}>
        Вы успешно создали аккаунт, пожалуйста подтвердите вашу почту!
      </h3>
      <div className={style.third__inner}>
        <span className={style.third__text}>Код с почты</span>
        <div className={style.third__inputBox}>
          <input
            type="text"
            onChange={(e) => onChange(e)}
            onKeyDown={(e) => onDeleteBox(e)}
            // onKeyUp={(e) => lastChar(e)}
            value={number1}
            id="1"
            ref={input1}
            className={style.third__inputBoxItem}
          />
          <input
            type="text"
            onChange={(e) => onChange(e)}
            onKeyDown={(e) => onDeleteBox(e)}
            value={number2}
            id="2"
            ref={input2}
            className={style.third__inputBoxItem}
          />
          <input
            type="text"
            onChange={(e) => onChange(e)}
            onKeyDown={(e) => onDeleteBox(e)}
            value={number3}
            id="3"
            ref={input3}
            className={style.third__inputBoxItem}
          />
          <input
            type="text"
            onChange={(e) => onChange(e)}
            onKeyDown={(e) => onDeleteBox(e)}
            value={number4}
            id="4"
            ref={input4}
            className={style.third__inputBoxItem}
          />
          <input
            type="text"
            onChange={(e) => onChange(e)}
            onKeyDown={(e) => onDeleteBox(e)}
            value={number5}
            id="5"
            ref={input5}
            className={style.third__inputBoxItem}
          />
          <input
            type="text"
            onChange={(e) => onChange(e)}
            onKeyDown={(e) => onDeleteBox(e)}
            value={number6}
            id="6"
            ref={input6}
            className={style.third__inputBoxItem}
          />
        </div>
        <RegistrationButton>Регистрация</RegistrationButton>
      </div>
    </div>
  );
}

export default ThirdStageReg;
