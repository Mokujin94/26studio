import React from "react";
import likeIcon from "../../resource/graphics/icons/newsCard/likes.svg";
import viewIcon from "../../resource/graphics/icons/newsCard/views.svg";
import commentIcon from "../../resource/graphics/icons/newsCard/comments.svg";

import style from "./projectCard.module.scss";

function ProjectCard({ img, title, name, date, like, view, comment }) {
  console.log(like);
  return (
    <div className={style.project}>
      <div className={style.project__blur}></div>
      <img
        src={process.env.REACT_APP_API_URL + img}
        className={style.project__photo}
        alt=""
      />
      <div className={style.project__text}>
        <h2 className={style.project__text__title}>{title}</h2>
        <h2 className={style.project__text__name}>{name}</h2>
      </div>
      <div className={style.project__bottom_info}>
        <div className={style.project__date}>{date}</div>
        <div className={style.project__stats}>
          <div className={style.project__stats_item}>
            <img src={likeIcon} alt="" />
            <div className={style.project__stats_item_value}>{like}</div>
          </div>
          <div className={style.project__stats_item}>
            <img src={viewIcon} alt="" />
            <div className={style.project__stats_item_value}>{view}</div>
          </div>
          <div className={style.project__stats_item}>
            <img src={commentIcon} alt="" />
            <div className={style.project__stats_item_value}>{comment}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProjectCard;
