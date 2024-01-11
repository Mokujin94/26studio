import React from "react";
import likeIcon from "../../resource/graphics/icons/newsCard/likes.svg";
import viewIcon from "../../resource/graphics/icons/newsCard/views.svg";
import commentIcon from "../../resource/graphics/icons/newsCard/comments.svg";

import style from "./projectCard.module.scss";
import { useDateFormatter } from "../../hooks/useDateFormatter";
import { useCountFormatter } from "../../hooks/useCountFormatter";

function ProjectCard({ img, title, name, date, like, view, comment }) {
  const formatedDate = useDateFormatter(date);
  const formatedLikes = useCountFormatter(like);
  const formatedViews = useCountFormatter(view);
  const formatedComments = useCountFormatter(comment);
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
        <div className={style.project__date}>{formatedDate}</div>
        <div className={style.project__stats}>
          <div className={style.project__stats_item}>
            <img src={likeIcon} alt="" />
            <div className={style.project__stats_item_value}>
              {formatedLikes}
            </div>
          </div>
          <div className={style.project__stats_item}>
            <img src={viewIcon} alt="" />
            <div className={style.project__stats_item_value}>
              {formatedViews}
            </div>
          </div>
          <div className={style.project__stats_item}>
            <img src={commentIcon} alt="" />
            <div className={style.project__stats_item_value}>
              {formatedComments}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProjectCard;
