import React, { useContext, useState } from "react";

import style from "./commentsEnd.module.scss";
import { Context } from "../..";
import { createProject } from "../../http/commentsAPI";

function CommentsEnd({ projectId }) {
  const { user } = useContext(Context);

  const [message, setMessage] = useState("");

  const sendMessage = async (e) => {
    e.preventDefault();
    await createProject(message, projectId);
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
