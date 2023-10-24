import React, { createRef, useContext, useEffect, useState } from "react";
import confetti from "canvas-confetti";
import style from "./thirdStageReg.module.scss";
import "./animThirdStage.scss";
import { observer } from "mobx-react-lite";
import { Context } from "../..";
import { registration } from "../../http/userAPI";
import MainButton from "../mainButton/MainButton";
import { CSSTransition } from "react-transition-group";

const ThirdStageReg = observer(
  ({
    setErrorMessage,
    setErrorModal,
    setCompleteModal,
    setCompleteMessage,
  }) => {
    const { user } = useContext(Context);

    const [number1, setNumber1] = useState("");
    const [number2, setNumber2] = useState("");
    const [number3, setNumber3] = useState("");
    const [number4, setNumber4] = useState("");
    const [number5, setNumber5] = useState("");
    const [number6, setNumber6] = useState("");

    const [code, setCode] = useState("");
    const [successReg, setSuccessReg] = useState(false);

    const endConfetti = Date.now() + 15 * 200;

    const colorsConfetti = ["#bb0000", "#ffffff"];

    function congrats() {
      confetti({
        particleCount: 2,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: colorsConfetti,
      });
      confetti({
        particleCount: 2,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: colorsConfetti,
      });

      if (Date.now() < endConfetti) {
        requestAnimationFrame(congrats);
      }
    }

    useEffect(() => {
      setCode(
        `${number1}` +
          `${number2}` +
          `${number3}` +
          `${number4}` +
          `${number5}` +
          `${number6}`
      );
    }, [number1, number2, number3, number4, number5, number6]);

    const registrationAccept = async () => {
      const formData = new FormData();
      formData.append("name", user.dataAuth.name);
      formData.append("full_name", user.dataAuth.fullName);
      formData.append("email", user.dataAuth.email);
      formData.append("password", user.dataAuth.password);
      formData.append("description", user.dataAuth.about);
      formData.append("avatar", user.dataAuth.avatar);
      formData.append("groupId", Number(user.dataAuth.group));
      const response = await registration(formData)
        .then((data) => {
          congrats();
          setCompleteModal(true);
          setCompleteMessage("Вы успешно зарегистрировались");
          setSuccessReg(true);
          user.setUser(data);
          user.setAuth(true);
        })
        .catch();
      return response;
    };

    useEffect(() => {
      if (code == user.codeAuth) {
        registrationAccept();
      } else if (code.length === 6 && code !== user.codeAuth) {
        setErrorMessage("Не верный код");
        setErrorModal(true);
      }
      console.log(user.codeAuth);
    }, [code]);

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

    return (
      <div className={style.third}>
        {/* <h3 className={style.third__title}>Вы успешно создали аккаунт, пожалуйста подтвердите вашу почту!</h3> */}
        <div className={style.third__inner}>
          <span className={style.third__text}>Код с почты</span>
          <div className={style.third__inputBox}>
            <input
              type="text"
              onChange={(e) => onChange(e)}
              onKeyDown={(e) => onDeleteBox(e)}
              value={number1}
              id="1"
              ref={input1}
              className={
                number1
                  ? `${style.third__inputBoxItem} ${style.third__inputBoxItem_active}`
                  : style.third__inputBoxItem
              }
            />
            <input
              type="text"
              onChange={(e) => onChange(e)}
              onKeyDown={(e) => onDeleteBox(e)}
              value={number2}
              id="2"
              ref={input2}
              className={
                number2
                  ? `${style.third__inputBoxItem} ${style.third__inputBoxItem_active}`
                  : style.third__inputBoxItem
              }
            />
            <input
              type="text"
              onChange={(e) => onChange(e)}
              onKeyDown={(e) => onDeleteBox(e)}
              value={number3}
              id="3"
              ref={input3}
              className={
                number3
                  ? `${style.third__inputBoxItem} ${style.third__inputBoxItem_active}`
                  : style.third__inputBoxItem
              }
            />
            <input
              type="text"
              onChange={(e) => onChange(e)}
              onKeyDown={(e) => onDeleteBox(e)}
              value={number4}
              id="4"
              ref={input4}
              className={
                number4
                  ? `${style.third__inputBoxItem} ${style.third__inputBoxItem_active}`
                  : style.third__inputBoxItem
              }
            />
            <input
              type="text"
              onChange={(e) => onChange(e)}
              onKeyDown={(e) => onDeleteBox(e)}
              value={number5}
              id="5"
              ref={input5}
              className={
                number5
                  ? `${style.third__inputBoxItem} ${style.third__inputBoxItem_active}`
                  : style.third__inputBoxItem
              }
            />
            <input
              type="text"
              onChange={(e) => onChange(e)}
              onKeyDown={(e) => onDeleteBox(e)}
              value={number6}
              id="6"
              ref={input6}
              className={
                number6
                  ? `${style.third__inputBoxItem} ${style.third__inputBoxItem_active}`
                  : style.third__inputBoxItem
              }
            />
          </div>
          <CSSTransition
            in={successReg}
            timeout={300}
            classNames="button"
            unmountOnExit
          >
            <div className={style.third__activeAcc}>
              <MainButton title={"Войти в аккаунт"} path="/projects" />
            </div>
          </CSSTransition>
        </div>
      </div>
    );
  }
);

export default ThirdStageReg;
