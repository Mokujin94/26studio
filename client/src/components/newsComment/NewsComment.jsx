import React, { useState } from "react";

import style from "./newsComment.module.scss";
import { Link } from "react-router-dom";
import { PROFILE_ROUTE } from "../../utils/consts";
import FunctionButton from "../functionButton/FunctionButton";
import { CSSTransition } from "react-transition-group";

function NewsComment(props) {

  const [isReply, setIsReply] = useState(false);
	return (
		<div className={style.block} >
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
        <div className={style.block__top__info}>
				<Link
					to={PROFILE_ROUTE + "/" + props.id}
					className={style.block__textName}
				>
					{props.name}
				</Link>
				<div className={style.block__textBottomDate}>{props.date}</div>

        </div>

				<h2 className={style.block__textComment}>{props.comment}</h2>
			</div>
			<div className={style.block__textBottom}>
				<div className={style.block__textBottomFeedback}>
					<p onClick={() => setIsReply(true)} className={style.block__textBottomFeedbackItem}>Ответить</p>
          <div className={style.block__textBottomFeedbackLike}>
            <div className={style.block__textBottomFeedbackItemImage}>
              <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M5.5 0C3.9875 0 2.64 0.741935 1.6225 1.90323C0.6325 3.06452 0 4.64516 0 6.45161C0 8.22581 0.6325 9.80645 1.6225 11L11 22L20.3775 11C21.3675 9.83871 22 8.25806 22 6.45161C22 4.67742 21.3675 3.09677 20.3775 1.90323C19.3875 0.741935 18.04 0 16.5 0C14.9875 0 13.64 0.741935 12.6225 1.90323C11.6325 3.06452 11 4.64516 11 6.45161C11 4.67742 10.3675 3.09677 9.3775 1.90323C8.3875 0.741935 7.04 0 5.5 0Z" fill="white"></path></svg>
            </div>
            <p className={style.block__textBottomFeedbackItemCount}>123</p>
          </div>

				</div>
			</div>
      <div className={style.block__input__wrapper} style={isReply ? {gridTemplateRows: "1fr"} : {gridTemplateRows: "0fr"}}>
      <CSSTransition
						in={isReply}
						timeout={300}
						classNames="create-anim"
						unmountOnExit
					>
        <div className={style.block__input}>
          <input type="text" placeholder="Ваш ответ" />
          <div className={style.block__input__buttons}>
            <button onClick={() => setIsReply(false)} className={style.block__input__buttons__item + ' ' + style.block__input__buttons__item_border}>Отменить</button>
            <button className={style.block__input__buttons__item}>Отменить</button>
          </div>
        </div>
      </CSSTransition>
      </div>

		</div>
	);
}

export default NewsComment;
