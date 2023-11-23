import React from "react";

import style from "./addProjectModalSecond.module.scss";

function AddProjectModalSecond({projectPathes, setStages }) {

  return (
    <div className={style.block}>
      <div className={style.block__info}>
        <div className={style.block__infoItem}>
          <h2 className={style.block__infoItemTitle}>Название</h2>
          <input className={style.block__infoItemInput} type="text" />
        </div>
        <div className={style.block__infoItem}>
          <h2 className={style.block__infoItemTitle}>Описание</h2>
          <textarea
            className={
              style.block__infoItemInput + " " + style.block__infoItemInput_area
            }
            name=""
            id=""
            cols="30"
            rows="10"
          ></textarea>
        </div>
        <div className={style.block__infoItem}>
          <h2 className={style.block__infoItemTitle}>
            Путь до основного файла
          </h2>
          <select className={style.block__infoItemInput} name="" id="">
            {projectPathes && projectPathes.map((item, i) => {
              return (
                <option key={i} value="">{item}</option>
              )
            })}
          </select>
        </div>
        <div className={style.block__infoItem}>
          <h2 className={style.block__infoItemTitle}>Превью</h2>
          <input style={{ display: "none" }} type="file" id="file_preview" />
          <label
            className={
              style.block__infoItemInput +
              " " +
              style.block__infoItemInput_preview
            }
            htmlFor="file_preview"
          >
            Загрузите фото
          </label>
        </div>
      </div>
      <div className={style.block__preview}>
        <h2 className={style.block__previewTitle}>Предпросмотр</h2>
        <div className={style.block__previewContent}>
          <iframe src="../../../../server/extracted/1054ec9b-7cc9-4e65-ac77-93086bacbc40/inex.html" frameborder="0"></iframe>
          <div className={style.block__previewText}>
            <h2 className={style.block__previewTextTitle}></h2>
            <p className={style.block__previewTextDescr}></p>
          </div>
        </div>
      </div>
      <button className={style.block__button} onClick={() => setStages(3)}>
        Далее
      </button>
    </div>
  );
}

export default AddProjectModalSecond;
