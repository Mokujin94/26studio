import { useEffect, useState } from "react";
import { fetchProject } from "../../http/projectAPI";

import style from "./projectViewer.module.scss";
import Spinner from "../spinner/Spinner";

const ProjectViewer = ({ pathFromProject, baseURL, styles, styleWrap }) => {
  const [htmlContent, setHtmlContent] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    fetchProject(pathFromProject, baseURL).then((data) => {
      setHtmlContent(data);
      console.log("content: " + data);
      console.log("pathFromProject: " + pathFromProject);
      console.log("baseUrl: " + baseURL);
      setIsLoading(false);
    });
  }, [pathFromProject, baseURL]);
  return (
    <div className={style.wrap} style={styleWrap}>
      {isLoading ? (
        <Spinner />
      ) : (
        <iframe
          title="Project Content"
          className={style.iframe}
          srcDoc={htmlContent}
          style={styles}
        />
      )}
    </div>
  );
};

export default ProjectViewer;
