import React, { useEffect, useState } from "react";

import ProjectHeader from "../../components/projectHeader/ProjectHeader";
import ProjectContent from "../../components/projectContent/ProjectContent";
import Comments from "../../components/comments/Comments";
import Description from "../../components/description/Description";

import "./project.scss";
import { fetchProjectById } from "../../http/projectAPI";
import { useParams } from "react-router";
import { getAllCommentsProject } from "../../http/commentsAPI";

function Project() {
  const { id } = useParams();

  const [dataProject, setDataProject] = useState({});

  const [comments, setComments] = useState([]);

  useEffect(() => {
    fetchProjectById(id).then((data) => setDataProject(data));
    getAllCommentsProject(id).then((data) =>
      setComments(data[0].comments_alls)
    );
  }, []);
  return (
    <div className="container">
      <div className="project">
        <div className="project__header">
          <ProjectHeader title={dataProject.name} />
        </div>
        <div className="project__content">
          <ProjectContent
            pathFromProject={dataProject.path_from_project}
            baseURL={dataProject.baseURL}
          />
          <Comments
            comments={comments}
            setComments={setComments}
            projectId={id}
          />
        </div>
        <div className="project__info">
          <Description
            title=""
            descr='Давно выяснено, что при оценке дизайна и композиции читаемый текст
        мешает сосредоточиться. Lorem Ipsum используют потому, что тот
        обеспечивает более или менее стандартное заполнение шаблона, а также
        реальное распределение букв и пробелов в абзацах, которое не получается
        при простой дубликации "Здесь ваш текст.. Здесь ваш текст.. Здесь ваш
        текст.." Многие программы электронной вёрстки и редакторы HTML
        используют Lorem Ipsum в качестве текста по умолчанию, так что поиск по
        ключевым словам "lorem ipsum" сразу показывает, как много веб-страниц
        всё ещё дожидаются своего настоящего рождения. За прошедшие годы текст
        Lorem Ipsum получил много версий. Некоторые версии появились по ошибке,
        некоторые - намеренно (например, юмористические варианты).'
          />
        </div>
      </div>
    </div>
  );
}

export default Project;
