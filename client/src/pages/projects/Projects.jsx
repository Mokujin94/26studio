import React, { useContext, useEffect, useState } from "react";
import ProjectCard from "../../components/projectCard/ProjectCard";
import projectPhoto from "../../resource/graphics/images/projectCard/bg.jpg";
import ProjectTags from "../../components/projectTags/ProjectTags";
import ProjectFilter from "../../components/projectFilter/ProjectFilter";
import { Splide, SplideTrack, SplideSlide } from "@splidejs/react-splide";

import "./projects.scss";
import "@splidejs/react-splide/css";

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
      project.setProjects(data.rows);
      console.log(data);
      setIsLoaded(false);
    });
    getAll("2").then((data) => {
      setProjectsData(data.rows);
      setIsLoadingSlider(false);
    });
  }, []);

  useEffect(() => {
    setIsLoaded(true);
    getAll(selectedItem).then((data) => {
      project.setProjects(data.rows);
      setIsLoaded(false);
    });
  }, [selectedItem]);

  useEffect(() => {
    searchProject(useDebounced, selectedItem).then((data) => {
      project.setProjects(data.rows);
      setIsLoaded(false);
    });
  }, [useDebounced]);

  const stylePrevArrow = { transform: "rotate(180deg)" };

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
    <SplideSlide>
      <ProjectSkeleton key={id} />
    </SplideSlide>
  ));

  const sliderRenderer = isLoadingSlider
    ? newLastAddedSkeletonList
    : projectsData.map((item) => {
        return (
          <SplideSlide>
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
          </SplideSlide>
        );
      });

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
          <Splide
            hasTrack={false}
            options={{
              type: "loop",
              perPage: 4,
              hasTrack: false,
              gap: 20,
              speed: 600,
              perMove: 1,
              arrows: true,
              pagination: false,
              autoplay: true,
              interval: 1500,
              rewind: true,
              omitEnd: true,
              trimSpace: true,
              padding: { top: 20, bottom: 20 },
              clones: true,
              cloneStatus: true,
            }}
          >
            <SplideTrack>{sliderRenderer}</SplideTrack>
            <div className="splide__arrows">
              <SliderButton
                className="splide__arrow splide__arrow--prev"
                styling={stylePrevArrow}
              />
              <SliderButton className="splide__arrow splide__arrow--next" />
            </div>
          </Splide>
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
