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
import { useCountFormatter } from "../../hooks/useCountFormatter";
import { viewProject } from "../../http/viewAPI";

function Project() {
  const { id } = useParams();
  const { user, error } = useContext(Context);

  const [dataProject, setDataProject] = useState({});
  const [amountLike, setAmountLike] = useState([]);
  const [comments, setComments] = useState([]);
  const [views, setViews] = useState([]);
  const [isLike, setIsLike] = useState(false);

  useEffect(() => {
    viewProject(id, user.user.id).catch((e) => console.log(e));
    fetchProjectById(id).then((data) => {
      setDataProject(data);
      setAmountLike(data.likes);
      setViews(data.views);
    });
    getAllCommentsProject(id).then((data) => setComments(data[0].comments));

    const socket = socketIOClient(
      "https://26studio-production.up.railway.app/"
    );

    socket.on("sendViewsToClients", (updatedViews) => {
      console.log("Получены новые просмотры:", updatedViews);
      if (updatedViews) {
        updatedViews.filter((item) => {
          if (item.id == id) {
            setViews(updatedViews[0].views);
          }
        });
      }
    });

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
            views={views}
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
          <Description title="Описание" descr={dataProject.description} />
        </div>
      </div>
    </div>
  );
}

export default Project;
