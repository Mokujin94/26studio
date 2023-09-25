import React from "react";

import style from "./thirdStageReg.module.scss";

function ThirdStageReg({ setStages }) {
  return (
    <>
      <div className={style.third}>
        <div className={style.third__inner}>
          <h3 className={style.third__title}>
            Вы успешно создали аккаунт, пожалуйста подтвердите вашу почту!
          </h3>
          <div className={style.third__inputBox}>
            <input type="text" id="1" className={style.third__inputBoxItem} />
            <input type="text" id="2" className={style.third__inputBoxItem} />
            <input type="text" id="3" className={style.third__inputBoxItem} />
            <input type="text" id="4" className={style.third__inputBoxItem} />
            <input type="text" id="5" className={style.third__inputBoxItem} />
            <input type="text" id="6" className={style.third__inputBoxItem} />
          </div>
        </div>
      </div>
    </>
  );
}

export default ThirdStageReg;
