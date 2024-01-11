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
import { fetchAllLikes, getAll, searchProject } from "../../http/projectAPI";
import { observer } from "mobx-react-lite";
import { Context } from "../..";
import { useDebounce } from "../../hooks/useDebounce";

const Projects = observer(() => {
  const { project } = useContext(Context);
  const [isLoaded, setIsLoaded] = useState(true);
  const [isLoadingSlider, setIsLoadingSlider] = useState(true);
  const [projectsData, setProjectsData] = useState([]);

  const [searchValue, setSearchValue] = useState("");
  const useDebounced = useDebounce(searchValue);

  const [selectedItem, setSelectedItem] = useState("0");

  useEffect(() => {
    setIsLoaded(true);
    setIsLoadingSlider(true);
    getAll().then((data) => {
      if (selectedItem === "0") {
        project.setProjects(
          data.rows.sort(
            (a, b) => Number(b.likes.length) - Number(a.likes.length)
          )
        );
      } else if (selectedItem === "1") {
        project.setProjects(
          data.rows.sort((a, b) => b.views.length - a.views.length)
        );
      } else {
        project.setProjects(
          data.rows.sort(
            (a, b) =>
              new Date(b.createdAt).getTime() / 1000 -
              new Date(a.createdAt).getTime() / 1000
          )
        );
      }

      setProjectsData(
        data.rows.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      );
      setIsLoaded(false);
      setIsLoadingSlider(false);
    });
  }, []);

  useEffect(() => {
    setIsLoaded(true);
    getAll().then((data) => {
      if (selectedItem === "0") {
        project.setProjects(
          data.rows.sort(
            (a, b) => Number(b.likes.length) - Number(a.likes.length)
          )
        );
      } else if (selectedItem === "1") {
        project.setProjects(
          data.rows.sort((a, b) => b.views.length - a.views.length)
        );
      } else {
        project.setProjects(
          data.rows.sort(
            (a, b) =>
              new Date(b.createdAt).getTime() / 1000 -
              new Date(a.createdAt).getTime() / 1000
          )
        );
      }
      setIsLoaded(false);
    });
  }, [selectedItem]);

  useEffect(() => {
    searchProject(useDebounced).then((data) => {
      if (selectedItem === "0") {
        project.setProjects(
          data.rows.sort(
            (a, b) => Number(b.likes.length) - Number(a.likes.length)
          )
        );
      } else if (selectedItem === "1") {
        project.setProjects(
          data.rows.sort((a, b) => b.views.length - a.views.length)
        );
      } else {
        project.setProjects(
          data.rows.sort(
            (a, b) =>
              new Date(b.createdAt).getTime() / 1000 -
              new Date(a.createdAt).getTime() / 1000
          )
        );
      }
      setIsLoaded(false);
    });
  }, [useDebounced]);

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

  const sliderRenderer = isLoadingSlider
    ? newLastAddedSkeletonList
    : projectsData.map((item) => {
        return (
          <Link to={PROJECTS_ROUTE + "/" + item.id} key={item.id}>
            <ProjectCard
              img={item.preview}
              title={item.name}
              name={item.user.name}
              date={item.start_date}
              like={item.likes.length}
              view={item.views.length}
              comment={item.comments.length}
            />
          </Link>
        );
      });

  console.log(projectsData);
  const projectLoading = isLoaded && newSkeletonList;
  const projectLoaded =
    !isLoaded &&
    project.projects.map((item) => {
      return (
        <Link
          className="projects__link"
          to={PROJECTS_ROUTE + "/" + item.id}
          key={item.id}
        >
          <ProjectCard
            img={item.preview}
            title={item.name}
            name={item.user.name}
            date={item.start_date}
            like={item.likes.length}
            view={item.views.length}
            comment={item.comments.length}
          />
        </Link>
      );
    });

  const projectError = !isLoaded && !project.projects.length && (
    <p className="projects__error">Не найдено</p>
  );

  return (
    <div className="container">
      <div className="projects">
        <h1 className="projects__title">Новые проекты</h1>
        <div className="projects__wrapper" style={{ display: "block" }}>
          <Slider {...settings}>{sliderRenderer}</Slider>
        </div>
        <div className="projects__searchSettings">
          <div className="projects__searchSettings-search">
            <ProjectsSearch
              searchValue={searchValue}
              setSearchValue={setSearchValue}
              setIsLoaded={setIsLoaded}
            />
          </div>
          <div className="projects__searchSettings-filter">
            <ProjectFilter
              selectedItem={selectedItem}
              setSelectedItem={setSelectedItem}
            />
          </div>
        </div>
        <div className="projects__wrapper">
          {projectLoading}
          {projectLoaded}
          {projectError}
        </div>
      </div>
    </div>
  );
});

export default Projects;
