import React from "react";
import PrimaryButton from "../primaryButton/PrimaryButton";

import style from "./projectsSearch.module.scss";

function ProjectsSearch() {
  return (
    <div className={style.projectsSearch}>
      <input type="text" placeholder="Поиск проектов" className={style.projectsSearch__input} />
      <PrimaryButton className={style.projectsSearch__btn}>Поиск</PrimaryButton>
    </div>
  );
}

export default ProjectsSearch;
