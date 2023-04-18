import React from "react";

import style from "./newsPaperHeader.module.scss";

function NewsPaperHeader(props) {
  return (
    <div className={style.block}>
      <h2 className={style.block__title}>{props.title}</h2>
      <p className={style.block__autor}>{props.autor}</p>
    </div>
  );
}

export default NewsPaperHeader;
