import React, { useEffect, useState } from "react";
import socketIOClient from "socket.io-client";
import CommentsEnd from "../commentsEnd/CommentsEnd";
import NewsComment from "../newsComment/NewsComment";

import style from "./comments.module.scss";

const Comments = ({ comments, setComments, projectId }) => {
  useEffect(() => {
    const socket = socketIOClient("http://localhost:3001");
    // console.log(socket);
    // Подписываемся на событие обновления комментариев
    socket.on("sendCommentsToClients", (updatedComments) => {
      console.log("Получены новые комментарии:", updatedComments);
      if (updatedComments) {
        if (updatedComments.projectId == projectId) {
          setComments((item) => [...item, updatedComments]);
        }
      }
    });

    // Закрываем соединение при размонтировании компонента
    return () => {
      socket.disconnect();
    };
  }, []); // Пустой массив зависимостей гарантирует, что эффект будет вызван только при монтировании компонента

  return (
    <div className={style.block}>
      <div className={style.block__title}>Комментарии</div>
      <div className={style.block__underline}></div>
      <div className={style.block__comments}>
        {comments.map((item) => {
          return (
            <NewsComment
              id={item.userId}
              name={item.user.name}
              avatar={item.user.avatar}
              comment={item.message}
              date="12:54 04.04.23"
              key={item.id}
            />
          );
        })}
      </div>
      <div className={style.block__bottom}>
        <CommentsEnd projectId={projectId} />
      </div>
    </div>
  );
};

export default Comments;
