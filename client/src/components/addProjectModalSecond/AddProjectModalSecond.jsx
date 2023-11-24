import React, { useEffect, useState } from "react";

import style from "./addProjectModalSecond.module.scss";
import ProjectViewer from "../ProjectViewer/ProjectViewer";

function AddProjectModalSecond({
  projectPathes,
  setStages,
  uniqueFolder,
  baseURL,
}) {
  const [selectedPath, setSelectedPath] = useState("");
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    console.log(uniqueFolder);
  }, uniqueFolder);

  const onSelectPath = (e) => {
    setSelectedPath(uniqueFolder + "/" + e.target.value);
  };

  return (
    <div className={style.block}>
      <div className={style.block__info}>
        <div className={style.block__infoItem}>
          <h2 className={style.block__infoItemTitle}>Название</h2>
          <input className={style.block__infoItemInput} type="text" value={name} onChange={(e) => setName(e.target.value)}/>
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
            value={description} onChange={(e) => setDescription(e.target.value)}
          ></textarea>
        </div>
        <div className={style.block__infoItem}>
          <h2 className={style.block__infoItemTitle}>
            Путь до основного файла
          </h2>
          <select
            className={style.block__infoItemInput}
            onChange={onSelectPath}
          >
            {projectPathes &&
              projectPathes.map((item, i) => {
                return (
                  <option key={i} value={item}>
                    {item}
                  </option>
                );
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
          <ProjectViewer pathFromProject={selectedPath} baseURL={baseURL} />
          <div className={style.block__previewText}>
            <h2 className={style.block__previewTextTitle}>{name ? name : 'Без названия'}</h2>
            <p className={style.block__previewTextDescr}>{description ? description : 'Без описания'}</p>
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
