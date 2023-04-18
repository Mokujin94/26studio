import React from "react";

import style from "./newsComment.module.scss";
import avatar from "../../resource/graphics/images/profile/avatar.jpg";

function NewsComment(props) {
  return (
    <div className={style.block}>
      <div className={style.block__text}>
        <div className={style.block__avatar}>
          <img className={style.block__avatarImg} src={avatar} alt="" />
        </div>
        <h2 className={style.block__textName}>{props.name}</h2>
        <h2 className={style.block__textComment}>{props.comment}</h2>
      </div>
      <div className={style.block__textBottom}>
          <div className={style.block__textBottomFeedback}>
            <p className={style.block__textBottomFeedbackItem}>Ответить</p>
            <p className={style.block__textBottomFeedbackItem}>Лайкнуть</p>
          </div>
          <div className={style.block__textBottomDate}>{props.date}</div>
        </div>
    </div>
  );
}

export default NewsComment;
