import React, { useState } from "react";

import style from "./addProjectModal.module.scss";
import "./animate.scss";
import AddProjectStages from "../addProjectStages/AddProjectStages";
import AddProjectModalFirst from "../addProjectModalFirst/AddProjectModalFirst";
import AddProjectModalSecond from "../addProjectModalSecond/AddProjectModalSecond";
import AddProjectModalThird from "../addProjectModalThird/AddProjectModalThird";
import { CSSTransition, SwitchTransition } from "react-transition-group";

function AddProjectModal() {
  const [stages, setStages] = useState(1);
  const [file, setFile] = useState(null);
  return (
    <div className={style.block}>
      <div className={style.block__header}>
        <h2 className={style.block__headerTitle}>Загрузка проекта</h2>
        <div className={style.block__headerClose}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="22"
            height="22"
            viewBox="0 0 22 22"
          >
            <path d="M1 11.0901H21Z" fill="#27323E" />
            <path
              d="M1 11.0901H21"
              stroke="#FCFCFC"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path d="M11 21L11 1Z" fill="#27323E" />
            <path
              d="M11 21L11 1"
              stroke="#FCFCFC"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </div>
      {stages > 1 && <AddProjectStages />}
      <SwitchTransition mode="out-in">
        <CSSTransition key={stages} timeout={300} classNames="node">
          <div className={style.block__content}>
            {file ? (
              stages === 2 ? (
                <AddProjectModalSecond setStages={setStages} />
              ) : stages === 3 ? (
                <AddProjectModalThird />
              ) : (
                <AddProjectModalFirst setFile={setFile} setStages={setStages} />
              )
            ) : (
              <AddProjectModalFirst setFile={setFile} setStages={setStages} />
            )}
          </div>
        </CSSTransition>
      </SwitchTransition>
    </div>
  );
}

export default AddProjectModal;
