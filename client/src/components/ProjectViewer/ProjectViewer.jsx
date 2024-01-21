import { useEffect, useState } from "react";
import { fetchProject } from "../../http/projectAPI";

import style from "./projectViewer.module.scss";

const ProjectViewer = ({ pathFromProject, baseURL, styles, styleWrap }) => {
  const [htmlContent, setHtmlContent] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const content = await fetchProject(pathFromProject, baseURL);
        setHtmlContent(content);
        console.log("content: " + content);
        console.log("pathFromProject: " + pathFromProject);
        console.log("baseUrl: " + baseURL);
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
