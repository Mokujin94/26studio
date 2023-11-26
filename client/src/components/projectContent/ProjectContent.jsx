import React from "react";

import style from "./projectContent.module.scss";
import photo from "../../resource/graphics/images/projectCard/bg.jpg";
import ProjectViewer from "../ProjectViewer/ProjectViewer";

function ProjectContent({ pathFromProject, baseURL }) {
  const styles = {
    width: "167%",
    height: "950px",
    MozTransformStyle: "scale(0.6)",
    OTransform: "scale(0.6)",
    WebkitTransform: "scale(0.6)",
  };

  const styleWrap = {
    height: "100%",
  };
  return (
    <div className={style.block}>
      <ProjectViewer
        pathFromProject={pathFromProject}
        baseURL={baseURL}
        styles={styles}
        styleWrap={styleWrap}
      />
    </div>
  );
}

export default ProjectContent;
