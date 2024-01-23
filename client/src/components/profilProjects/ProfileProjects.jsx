import React, { useEffect, useState } from "react";

import projectPhoto from "../../resource/graphics/images/projectCard/bg.jpg";

import ProjectCard from "../projectCard/ProjectCard";
import { observer } from "mobx-react-lite";
import { fetchProjectsUser } from "../../http/projectAPI";
import { Link, useLocation, useParams } from "react-router-dom";
import { PROJECTS_ROUTE } from "../../utils/consts";

import style from './profileProjects.module.scss'

const ProfileProjects = observer(() => {
  const { id } = useParams();
  const location = useLocation();
  const [dataProjects, setDataProjects] = useState([]);
  useEffect(() => {
    fetchProjectsUser(id).then((data) => setDataProjects(data.projects));
  }, [location.pathname]);
  return (
    <>
      {dataProjects.length ? (
        dataProjects.map((item) => {
        return (
          <Link to={PROJECTS_ROUTE + "/" + item.id} key={item.id}>
            <ProjectCard
              img={item.preview}
              title={item.name}
              date={item.start_date}
              like={item.likes.length}
              view={item.views.length}
              comment={item.comments.length}
            />
          </Link>
        );
      })
      ) : (
        <div className={style.projects}>
          <div className={style.projects__icon}>
            <svg version="1.1" id="Icons" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
              viewBox="0 0 32 32" xmlSpace="preserve">
              <path d="M6,27h21c1.1,0,2-0.9,2-2V11c0-1.1-0.9-2-2-2l-9.5,0"/>
              <path d="M28.5,26.3L17.5,9L15,5h-2.5H5C3.9,5,3,5.9,3,7v17"/>
              <path d="M7.5,15.5c-1.9,1.9-1.9,5.1,0,7c0.5,0.5,1,0.8,1.6,1.1c1.8,0.7,3.9,0.4,5.4-1.1c1.9-1.9,1.9-5.1,0-7
                S9.5,13.6,7.5,15.5z"/>
              <path d="M6.5,21l-3.9,3.6c-0.8,0.8-0.8,2,0,2.8l0,0c0.8,0.8,2,0.8,2.8,0l3.5-3.5"/>
            </svg>
          </div>
          <h2 className={style.projects__title}>У вас нет проектов</h2>
        </div>
      )}
    </>
  );
});

export default ProfileProjects;
