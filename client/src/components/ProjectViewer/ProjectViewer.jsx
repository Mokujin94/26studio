import { useEffect, useState } from "react";
import { fetchProject } from "../../http/projectAPI";

import style from "./projectViewer.module.scss";

const ProjectViewer = ({ pathFromProject, baseURL, styles, styleWrap }) => {
  const [htmlContent, setHtmlContent] = useState("");

  useEffect(() => {
    fetchProject(pathFromProject, baseURL).then((data) => {
      setHtmlContent(data);
      console.log("content: " + content);
      console.log("pathFromProject: " + pathFromProject);
      console.log("baseUrl: " + baseURL);
    });
  }, [pathFromProject, baseURL]);
  return (
    <div className={style.wrap} style={styleWrap}>
      <iframe
        title="Project Content"
        className={style.iframe}
        srcDoc={htmlContent}
        style={styles}
      />
    </div>
  );
};

export default ProjectViewer;
