import React from "react";
import PrimaryButton from "../primaryButton/PrimaryButton";

import style from "./projectsSearch.module.scss";

function ProjectsSearch({ searchValue, setSearchValue, setIsLoaded }) {
  return (
    <div className={style.projectsSearch}>
      <input
        value={searchValue}
        onChange={(e) => {
          setSearchValue(e.target.value);
          setIsLoaded(true);
        }}
        type="text"
        placeholder="Поиск проектов"
        className={style.projectsSearch__input}
      />
      {/* <PrimaryButton className={style.projectsSearch__btn}>Поиск</PrimaryButton> */}
    </div>
  );
}

export default ProjectsSearch;
