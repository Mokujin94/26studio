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
import { useParams, useLocation } from "react-router";
import { getAllCommentsProject } from "../../http/commentsAPI";
import { Context } from "../..";
import { useCountFormatter } from "../../hooks/useCountFormatter";
import { viewProject } from "../../http/viewAPI";

function Project() {
  const { id } = useParams();
  const { user, error } = useContext(Context);
  const location = useLocation();
  const [dataProject, setDataProject] = useState({});
  const [amountLike, setAmountLike] = useState([]);
  const [comments, setComments] = useState([]);
  const [views, setViews] = useState([]);
  const [isLike, setIsLike] = useState(false);

  useEffect(() => {
    viewProject(id, user.user.id).catch((e) => console.log(e));
    fetchProjectById(id).then((data) => {
      console.log(data);
      setDataProject(data);
      setAmountLike(data.likes.length);
      data.likes.filter((item) => {
        if (item.userId === user.user.id && item.status) {
          setIsLike(true);
          console.log(true);
        }
      });
      setViews(data.views);
    });
    getAllCommentsProject(id).then((data) => setComments(data[0].comments));

    // const socket = socketIOClient("https://26studio-production.up.railway.app");
    const socket = socketIOClient(process.env.REACT_APP_API_URL);

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

    return () => {
      socket.disconnect();
    };
  }, [location.pathname, user.user.id]);

  const setLike = async () => {
    await condidate(id, user.user.id)
      .then(async (dataCondidate) => {
        if (dataCondidate.length) {
          await deleteLike(id, user.user.id)
            .then(() => {
              setIsLike(false);
              setAmountLike((amountLike) => amountLike - 1);
            })
            .catch((data) => {
              console.log(data.response.data.message);
              error.setNotAuthError(true);
            });
        } else {
          await like(id, user.user.id)
            .then(() => {
              setIsLike(true);
              setAmountLike((amountLike) => amountLike + 1);
            })
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
          <Description title="Описание" descr={dataProject.description} />
        </div>
        <div className="project__info">
          <Comments
            comments={comments}
            setComments={setComments}
            projectId={id}
          />
        </div>
      </div>
    </div>
  );
}

export default Project;
