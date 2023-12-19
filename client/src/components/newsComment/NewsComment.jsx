import React from "react";

import style from "./newsComment.module.scss";
import { Link } from "react-router-dom";
import { PROFILE_ROUTE } from "../../utils/consts";

function NewsComment(props) {
  return (
    <div className={style.block}>
      <div className={style.block__text}>
        <Link
          to={PROFILE_ROUTE + "/" + props.id}
          className={style.block__avatar}
        >
          <img
            className={style.block__avatarImg}
            src={process.env.REACT_APP_API_URL + props.avatar}
            alt="avatar"
          />
        </Link>
        <Link
          to={PROFILE_ROUTE + "/" + props.id}
          className={style.block__textName}
        >
          {props.name}
        </Link>
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
