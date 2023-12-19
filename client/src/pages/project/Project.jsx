import React, { useContext, useEffect, useState } from "react";
import socketIOClient from "socket.io-client";
import ProjectHeader from "../../components/projectHeader/ProjectHeader";
import ProjectContent from "../../components/projectContent/ProjectContent";
import Comments from "../../components/comments/Comments";
import Description from "../../components/description/Description";

import "./project.scss";
import {
  condidate,
  deleteLike,
  fetchAllLikes,
  fetchProjectById,
  like,
} from "../../http/projectAPI";
import { useParams } from "react-router";
import { getAllCommentsProject } from "../../http/commentsAPI";
import { Context } from "../..";

function Project() {
  const { id } = useParams();
  const { user, error } = useContext(Context);

  const [dataProject, setDataProject] = useState({});
  const [amountLike, setAmountLike] = useState([]);
  const [comments, setComments] = useState([]);
  const [isLike, setIsLike] = useState(false);

  useEffect(() => {
    fetchProjectById(id).then((data) => {
      setDataProject(data);
      setAmountLike(data.likes);
    });
    getAllCommentsProject(id).then((data) => setComments(data[0].comments));

    const socket = socketIOClient("http://localhost:3001");
    // console.log(socket);
    // Подписываемся на событие обновления комментариев
    socket.on("sendLikesToClients", (updatedLikes) => {
      console.log("Получены новые комментарии:", updatedLikes);
      if (updatedLikes) {
        updatedLikes.filter((item) => {
          if (item.id == id) {
            setAmountLike(updatedLikes[0].likes);
          }
        });
      }
    });

    // Закрываем соединение при размонтировании компонента
    return () => {
      socket.disconnect();
    };
  }, []);

  useEffect(() => {
    if (amountLike) {
      console.log("true");
      for (let i = 0; i < amountLike.length; i++) {
        if (amountLike[i].userId === user.user.id) {
          setIsLike(true);
        }
      }
    }
  }, [user, amountLike]);

  const setLike = async () => {
    console.log(user.user.id);
    await condidate(id, user.user.id)
      .then(async (dataCondidate) => {
        if (dataCondidate.length) {
          await deleteLike(id, user.user.id)
            .then(setIsLike(false))
            .catch((data) => {
              console.log(data.response.data.message);
              error.setNotAuthError(true);
            });
        } else {
          await like(id, user.user.id)
            .then(setIsLike(true))
            .catch((data) => {
              console.log(data.response.data.message);
              error.setNotAuthError(true);
            });
        }
      })
      .catch((data) => {
        console.log(data.response.data.message);
        error.setNotAuthError(true);
      });
  };
  return (
    <div className="container">
      <div className="project">
        <div className="project__header">
          <ProjectHeader
            title={dataProject.name}
            onClick={setLike}
            likes={amountLike}
            isLike={isLike}
          />
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
