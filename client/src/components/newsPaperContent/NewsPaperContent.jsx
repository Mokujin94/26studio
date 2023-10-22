import React from 'react';

import style from './newsPaperContent.module.scss';

function NewsPaperContent({ img }) {
  return (
    <div className={style.block}>
      <img className={style.block__img} src={img} alt="" />
    </div>
  );
}

export default NewsPaperContent;
