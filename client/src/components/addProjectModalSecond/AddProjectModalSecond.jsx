import React, { useContext, useEffect, useState } from "react";

import { observer } from "mobx-react-lite";

import style from "./addProjectModalSecond.module.scss";
import ProjectViewer from "../ProjectViewer/ProjectViewer";
import { Context } from "../..";

const AddProjectModalSecond = observer(
  ({ projectPathes, setStages, uniqueFolder, baseURL }) => {
    const { project, modal } = useContext(Context);
    const onSelectPath = (e) => {
      project.setProjectPath(uniqueFolder + "/" + e.target.value);
      project.setProjectSelectedPath(e.target.value);
    };

    const selectPreviewFile = (e) => {
      project.setProjectPreview(e.target.files[0]);
    };

    const onButton = (e) => {
      let message = [];
      if (
        !project.projectName ||
        !project.projectDescr ||
        !project.projectSelectedPath ||
        !project.projectPreview
      ) {
        if (!project.projectName) {
          message.push(`Название не заполнено`);
        }

        if (!project.projectDescr) {
          message.push(`Описание не заполнено`);
        }

        if (!project.projectSelectedPath) {
          message.push(`Файл не выбран`);
        }

        if (!project.projectPreview) {
          message.push(`Превью не выбрано`);
        }

        modal.setModalComplete(true);
        modal.setModalCompleteMessage(message.join(`\n \n`));
        return;
      }
      setStages(3);
    };

    return (
      <div className={style.block}>
        <div className={style.block__info}>
          <div className={style.block__infoItem}>
            <h2 className={style.block__infoItemTitle}>Название</h2>
            <input
              className={style.block__infoItemInput}
              type="text"
              value={project.projectName}
              onChange={(e) => project.setProjectName(e.target.value)}
            />
          </div>
          <div className={style.block__infoItem}>
            <h2 className={style.block__infoItemTitle}>Описание</h2>
            <textarea
              className={
                style.block__infoItemInput +
                " " +
                style.block__infoItemInput_area
              }
              name=""
              id=""
              cols="30"
              rows="10"
              value={project.projectDescr}
              onChange={(e) => project.setProjectDescr(e.target.value)}
            ></textarea>
          </div>
          <div className={style.block__infoItem}>
            <h2 className={style.block__infoItemTitle}>
              Путь до основного файла
            </h2>
            <select
              className={style.block__infoItemInput}
              onChange={onSelectPath}
              // value={project.projectSelectedPath}
            >
              <option selected disabled>
                Выберите файл
              </option>
              {projectPathes &&
                projectPathes.map((item, i) => {
                  // if (item.split('.').at(-1) === 'html') {
                  //   return (

                  //   );
                  // }
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
            <input
              style={{ display: "none" }}
              type="file"
              id="file_preview"
              onChange={selectPreviewFile}
              accept="image/png, image/jpeg"
            />
            <label
              className={
                style.block__infoItemInput +
                " " +
                style.block__infoItemInput_preview
              }
              htmlFor="file_preview"
            >
              {project.projectPreview
                ? project.projectPreview.name.length > 20
                  ? project.projectPreview.name.slice(0, 20) + "..."
                  : project.projectPreview.name
                : "Загрузите фото"}
            </label>
          </div>
        </div>
        <div className={style.block__preview}>
          <h2 className={style.block__previewTitle}>Предпросмотр</h2>
          <div className={style.block__previewContent}>
            <ProjectViewer
              pathFromProject={project.projectPath}
              baseURL={baseURL}
            />
            <div className={style.block__previewText}>
              <h2 className={style.block__previewTextTitle}>
                {project.projectName}
              </h2>
              <p className={style.block__previewTextDescr}>
                {project.projectDescr}
              </p>
            </div>
          </div>
        </div>
        <button className={style.block__button} onClick={onButton}>
          Далее
        </button>
      </div>
    );
  }
);

export default AddProjectModalSecond;
