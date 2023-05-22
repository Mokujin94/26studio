import React from 'react'

import { Link } from 'react-router-dom'
import { NEWSPAPER_ROUTE } from '../../utils/consts'

import style from './newsCard.module.scss'

// import preview from '../../resource/graphics/images/newsCard/preview.jpg'
// import avatar from '../../resource/graphics/images/newsCard/avatar.jpg'
import likesIcon from '../../resource/graphics/icons/newsCard/likes.svg'
import viewsIcon from '../../resource/graphics/icons/newsCard/views.svg'
import commentsIcon from '../../resource/graphics/icons/newsCard/comments.svg'


function NewsCard({title, description, img, avatar, likes, comments, views}) {
  return (
    // <Link className={style.cardLink} to={NEWSPAPER_ROUTE}>
        <div className={style.card}>
            <div className={style.preview}>
                <img src={img} alt="img" className={style.preview__img} />
            </div>
            {/* <div className={style.avatar}>
                    <img src={avatar} alt="img" className={style.avatar__img} />
                </div> */}
            <div className={style.info}>
                <h2 className={style.title}>{title}</h2>
                <div className={style.description}>{description}</div>
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
    // </Link>
  )
}

export default NewsCard