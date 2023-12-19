import React, { useContext, useEffect, useState } from "react";
import ProjectCard from "../../components/projectCard/ProjectCard";
import projectPhoto from "../../resource/graphics/images/projectCard/bg.jpg";
import ProjectTags from "../../components/projectTags/ProjectTags";
import ProjectFilter from "../../components/projectFilter/ProjectFilter";
import Slider from "react-slick";

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "./projects.scss";

import ProjectSkeleton from "../../components/ProjectSkeleton";
import SliderButton from "../../components/sliderButton/SliderButton";
import { Link } from "react-router-dom";
import { PROJECTS_ROUTE, PROJECT_ROUTE } from "../../utils/consts";
import ProjectsSearch from "../../components/projectsSearch/ProjectsSearch";
import { fetchAllLikes, getAll } from "../../http/projectAPI";
import { observer } from "mobx-react-lite";
import { Context } from "../..";

const Projects = observer(() => {
  const { project } = useContext(Context);
  const [isLoaded, setIsLoaded] = useState(true);
  const [likes, setLikes] = useState([]);
  const stylePrevArrow = { transform: "rotate(180deg)" };

  const settings = {
    dots: false,
    infinite: true,
    slidesToShow: 4,
    slidesToScroll: 1,
    autoplay: true,
    // speed: 2000,
    autoplaySpeed: 2000,
    pauseOnHover: true,
    // cssEase: "linear"
    nextArrow: <SliderButton />,
    prevArrow: <SliderButton styling={stylePrevArrow} />,
  };

  const skeletonList = [
    { id: 0 },
    { id: 1 },
    { id: 2 },
    { id: 3 },
    { id: 4 },
    { id: 5 },
    { id: 6 },
    { id: 7 },
    { id: 8 },
    { id: 9 },
    { id: 10 },
  ];
  const lastAddedSkeletonList = [{ id: 0 }, { id: 1 }, { id: 2 }, { id: 3 }];

  const newSkeletonList = skeletonList.map(({ id }) => (
    <ProjectSkeleton key={id} />
  ));
  const newLastAddedSkeletonList = lastAddedSkeletonList.map(({ id }) => (
    <ProjectSkeleton key={id} />
  ));

  useEffect(() => {
    setIsLoaded(true);
    getAll().then((data) => {
      project.setProjects(data.rows);
      console.log(data.rows);
      setIsLoaded(false);
    });
    // fetchAllLikes().then((data) => setLikes(data.likes));
  }, []);

  return (
    <div className="container">
      <div className="projects">
        <h1 className="projects__title">Последние добавленные проекты</h1>
        <div className="projects__wrapper" style={{ display: "block" }}>
          <Slider {...settings}>
            {isLoaded
              ? newLastAddedSkeletonList
              : project.projects.map((item) => {
                  console.log(item);
                  return (
                    <Link to={PROJECTS_ROUTE + "/" + item.id} key={item.id}>
                      <ProjectCard
                        img={item.preview}
                        title={item.name}
                        date={item.start_date}
                        like={item.likes.length}
                        view={item.amount_views}
                        comment={item.comments.length}
                      />
                    </Link>
                  );
                })}
            {/* {newLastAddedSkeletonList} */}
          </Slider>
        </div>
        <div className="projects__searchSettings">
          <div className="projects__searchSettings-search">
            <ProjectsSearch />
          </div>
          <div className="projects__searchSettings-filter">
            <ProjectFilter />
          </div>
        </div>
        <div className="projects__wrapper">
          {isLoaded
            ? newSkeletonList
            : project.projects.map((item) => {
                return (
                  <Link to={PROJECTS_ROUTE + "/" + item.id} key={item.id}>
                    <ProjectCard
                      img={item.preview}
                      title={item.name}
                      date={item.start_date}
                      like={item.likes.length}
                      view={item.amount_views}
                      comment={item.comments.length}
                    />
                  </Link>
                );
              })}
        </div>
      </div>
    </div>
  );
});

export default Projects;
//<ProjectCard img={projectPhoto} title={'Arkana'} name={'mokujin94'} date={'03.04.23'} like={22} view={232} comment={12}/>
