import React from 'react';

import { Link } from 'react-router-dom';
import { NEWSPAPER_ROUTE } from '../../utils/consts';

import style from './newsCard.module.scss';

import likesIcon from '../../resource/graphics/icons/newsCard/likes.svg';
import viewsIcon from '../../resource/graphics/icons/newsCard/views.svg';
import commentsIcon from '../../resource/graphics/icons/newsCard/comments.svg';

function NewsCard({ title, description, img, likes, comments, views }) {
  return (
    <div className={style.card}>
      <div className={style.preview}>
        <img src={img} alt="img" className={style.preview__img} />
      </div>
      <div className={style.info}>
        <h2 className={style.title}>{title}</h2>
        <p className={style.description}>{description}</p>
        <div className={style.line}></div>
      </div>
      <div className={style.stats}>
        <div className={style.stats__item}>
          <img src={likesIcon} alt="icon" />
          <div className={style.stats__count}>{likes}</div>
        </div>
        <div className={style.stats__item}>
          <img src={commentsIcon} alt="icon" />
          <div className={style.stats__count}>{comments}</div>
        </div>
        <div className={style.stats__item}>
          <img src={viewsIcon} alt="icon" />
          <div className={style.stats__count}>{views}</div>
        </div>
      </div>
    </div>
  );
}

export default NewsCard;
