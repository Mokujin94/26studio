import React, { useContext, useEffect, useRef, useState } from "react";
import socketIOClient from "socket.io-client";
import ContentStats from "../../components/contentStats/ContentStats";
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
import { observer } from "mobx-react-lite";
import { fetchUserById } from "../../http/userAPI";

const Project = observer(() => {
    const { id } = useParams();
    const { user, error } = useContext(Context);
    const location = useLocation();
    const [dataProject, setDataProject] = useState({});
    const [dataUser, setDataUser] = useState({});
    const [description, setDescription] = useState([]);
    const [amountLike, setAmountLike] = useState([]);
    const [comments, setComments] = useState([]);
    const [views, setViews] = useState([]);
    const [isLike, setIsLike] = useState(false);
    const [likeLoading, setLikeLoading] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [isLoadingComments, setIsLoadingComments] = useState(true);

    useEffect(() => {
        setIsLoading(true);
        setIsLoadingComments(true)
        viewProject(id, user.user.id).catch((e) => console.log(e));
        fetchProjectById(id).then((data) => {

            setDataProject(data);
            setDataUser(data.user);
            setDescription(data.description);
            setAmountLike(data.likes.length);
            data.likes.filter((item) => {
                if (item.userId === user.user.id && item.status) {
                    setIsLike(true);
                }
            });
            setViews(data.views);
        }).finally(() => {
            setIsLoading(false)
        });
        getAllCommentsProject(id).then((data) => {
            const filterData = data[0].comments.filter(item => !item.parentId);
            setComments(filterData)
        }).finally(() => {
            setIsLoadingComments(false)
        });

        // const socket = socketIOClient("https://26studio-production.up.railway.app");
        const socket = socketIOClient(process.env.REACT_APP_API_URL);

        socket.on("sendViewsToClients", (updatedViews) => {
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
        setLikeLoading(true);
        await condidate(id, user.user.id)
            .then(async (dataCondidate) => {
                if (dataCondidate.length) {
                    await deleteLike(id, user.user.id)
                        .then(() => {
                            setIsLike(false);
                            setAmountLike((amountLike) => amountLike - 1);
                            setLikeLoading(false);
                        })
                        .catch((data) => {

                            error.setNotAuthError(true);
                            setLikeLoading(false)
                        });
                } else {
                    await like(id, user.user.id)
                        .then(() => {
                            setIsLike(true);
                            setAmountLike((amountLike) => amountLike + 1);
                            setLikeLoading(false);
                        })
                        .catch((data) => {

                            error.setNotAuthError(true);
                            setLikeLoading(false)
                        });
                }
            })
            .catch((data) => {

                error.setNotAuthError(true);
                setLikeLoading(false)
            });
    };
    return (
        <div className="container">
            <div className="project">
                <div className="project__content">
                    <ProjectContent
                        pathFromProject={dataProject.path_from_project}
                        baseURL={dataProject.baseURL}
                    />
                    {/* <Description title="Описание" descr={description} /> */}
                </div>
                <div className="project__header">
                    <ContentStats
                        dataUser={dataUser}
                        title={dataProject.name}
                        descr={description}
                        onClick={setLike}
                        likes={amountLike}
                        isLike={isLike}
                        views={views}
                        likeLoading={likeLoading}
                        isLoading={isLoading}
                        date={dataProject.start_date}
                    />
                </div>
                <div className="project__info">
                    <Comments
                        comments={comments}
                        setComments={setComments}
                        projectId={id}
                        isLoading={isLoadingComments}
                    />
                </div>
            </div>
        </div>
    );
})

export default Project;
