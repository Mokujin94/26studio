import React from "react";
import CommentsEnd from "../commentsEnd/CommentsEnd";
import NewsComment from "../newsComment/NewsComment";

import style from "./comments.module.scss";

function Comments() {
  return (
    <div className={style.block}>
      <div className={style.block__title}>Комментарии</div>
      <div className={style.block__underline}></div>
      <div className={style.block__comments}>
        <NewsComment
          name="Mokujin94"
          comment="Скучная новость, удалите!"
          date="12:54 04.04.23"
        />
        <NewsComment
          name="Zeliboba"
          comment="Ну и новость конечно, фу, не могу на это смотретьНу и новость конечно, фу, не могу на это смотретьНу и новость конечно, фу, не могу на это смотретьНу и новость конечно, фу, не могу на это смотреть"
          date="12:54 02.04.23"
        />
        <NewsComment
          name="Mokujin94"
          comment="Скучная новость, удалите!Скучная новость, удалите!Скучная новость, удалите!Скучная новость, удалите!Скучная новость, удалите!Скучная новость, удалите!Скучная новость, удалите!Скучная новость, удалите!Скучная новость, удалите!Скучная новость, удалите!Скучная новость, удалите!Скучная новость, удалите!Скучная новость, удалите!Скучная новость, удалите!Скучная новость, удалите!Скучная новость, удалите!Скучная новость, удалите!Скучная новость, удалите!"
          date="12:54 04.04.23"
        />
        <NewsComment
          name="Zeliboba"
          comment="Ну и новость конечно, фу, не могу на это смотреть"
          date="12:54 02.04.23"
        />
        <NewsComment
          name="Mokujin94"
          comment="Скучная новость, удалите!"
          date="12:54 04.04.23"
        />
        <NewsComment
          name="Zeliboba"
          comment="Ну и новость конечно, фу, не могу на это смотреть"
          date="12:54 02.04.23"
        />
        <NewsComment
          name="Mokujin94"
          comment="Скучная новость, удалите!"
          date="12:54 04.04.23"
        />
      </div>
      <div className={style.block__bottom}>
        <CommentsEnd />
      </div>
    </div>
  );
}

export default Comments;
