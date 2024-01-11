import React, { useContext, useState } from "react";

import style from "./commentsEnd.module.scss";
import { Context } from "../..";
import { createNews, createProject } from "../../http/commentsAPI";

function CommentsEnd({ projectId, newsId }) {
  const { user, error } = useContext(Context);

  const [message, setMessage] = useState("");

  const sendMessage = async (e) => {
    e.preventDefault();

    if (message.replace(/\s/g, "")) {
      if (projectId) {
        await createProject(message, projectId, user.user.id)
          .then(setMessage(""))
          .catch((err) => {
            console.log(err.response.data.message);
            error.setNotAuthError(true);
          });
      }
      if (newsId) {
        await createNews(message, newsId, user.user.id)
          .then(setMessage(""))
          .catch((err) => {
            console.log(err.response.data.message);
            error.setNotAuthError(true);
          });
      }
    }
  };
  return (
    <form className={style.block}>
      <input
        className={style.block__input}
        type="text"
        placeholder="Напишите текст"
        onChange={(e) => setMessage(e.target.value)}
        value={message}
      />
      <button
        type="submit"
        className={style.block__btn}
        onClick={(e) => sendMessage(e)}
      >
        Отправить
      </button>
    </form>
  );
}

export default CommentsEnd;
