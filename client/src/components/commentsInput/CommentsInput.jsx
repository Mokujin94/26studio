import React, { useContext, useState } from "react";

import style from "./commentsInput.module.scss";
import { Context } from "../..";
import { createNews, createProject } from "../../http/commentsAPI";
import Spinner from "../spinner/Spinner";

function CommentsEnd({ projectId, newsId }) {
  const { user, error } = useContext(Context);

  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const sendMessage = async (e) => {
    e.preventDefault();

    if (message.replace(/\s/g, "")) {
      setIsLoading(true);
      if (projectId) {
        await createProject(message, projectId, user.user.id)
          .then(() => {
            setMessage("");
            setIsLoading(false);
          })
          .catch((err) => {
            console.log(err.response.data.message);
            error.setNotAuthError(true);
            setIsLoading(false);
          });
      }
      if (newsId) {
        await createNews(message, newsId, user.user.id)
          .then(() => {
            setMessage("");
            setIsLoading(false);
          })
          .catch((err) => {
            console.log(err.response.data.message);
            error.setNotAuthError(true);
            setIsLoading(false);
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
        disabled={isLoading}
      >
        {isLoading ? <Spinner /> : "Отправить"}
      </button>
    </form>
  );
}

export default CommentsEnd;
