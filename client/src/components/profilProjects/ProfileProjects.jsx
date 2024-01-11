import React, { useEffect, useState } from "react";

import projectPhoto from "../../resource/graphics/images/projectCard/bg.jpg";

import ProjectCard from "../projectCard/ProjectCard";
import { observer } from "mobx-react-lite";
import { fetchProjectsUser } from "../../http/projectAPI";
import { Link, useParams } from "react-router-dom";
import { PROJECTS_ROUTE } from "../../utils/consts";

const ProfileProjects = observer(() => {
  const { id } = useParams();

  const [dataProjects, setDataProjects] = useState([]);
  useEffect(() => {
    fetchProjectsUser(id).then((data) => setDataProjects(data.projects));
  }, []);
  return (
    <>
      {dataProjects.map((item) => {
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
      })}
    </>
  );
});

export default ProfileProjects;
