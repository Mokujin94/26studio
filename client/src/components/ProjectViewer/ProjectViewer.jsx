import { useEffect, useState } from "react";
import { fetchProject } from "../../http/projectAPI";

import style from "./projectViewer.module.scss";

const ProjectViewer = ({ pathFromProject, baseURL, styles, styleWrap }) => {
  const [htmlContent, setHtmlContent] = useState("");

  useEffect(() => {
    console.log(pathFromProject);
    const fetchData = async () => {
      try {
        const content = await fetchProject(pathFromProject, baseURL);
        setHtmlContent(content);
      } catch (error) {
        // Обработка ошибок
      }
    };

    fetchData();
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
