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
import Spinner from "../../components/spinner/Spinner";
import { CSSTransition } from "react-transition-group";

const Projects = observer(() => {
  const { project } = useContext(Context);
  const [isLoaded, setIsLoaded] = useState(true);
  const [isLoadedSpinner, setIsLoadedSpinner] = useState(false);
  const [isLoadingSlider, setIsLoadingSlider] = useState(true);
  const [sliderData, setSliderData] = useState([]);
  const [projectsData, setProjectsData] = useState([]);

  const [searchValue, setSearchValue] = useState("");
  const useDebounced = useDebounce(searchValue);

  const [selectedItem, setSelectedItem] = useState("0");
  const [currentPage, setCurrentPage] = useState(1);
  const [fetching, setFetching] = useState(true);
  const [totalCount, setTotalCount] = useState(0);
  const [totalCountSearch, setTotalCountSearch] = useState(0);

  useEffect(() => {
    setIsLoaded(true);
    setIsLoadingSlider(true);
    getAll("2").then((data) => {
      setSliderData(data.rows);
      setIsLoadingSlider(false);
    });

    searchProject(useDebounced, selectedItem, currentPage).then((data) => {
      console.log(data);
      console.log(data);
      setProjectsData(data.rows);
      setIsLoaded(false);
    });
  }, []);

  useEffect(() => {
    if (fetching) {
      setIsLoadedSpinner(true);
      searchProject(useDebounced, selectedItem, currentPage)
        .then((data) => {
          setProjectsData([...projectsData, ...data.rows]);
          setCurrentPage((page) => page + 1);
          setTotalCountSearch(data.countSearch);
          console.log(data);
          setIsLoadedSpinner(false);
          setIsLoaded(false);
        })
        .finally(() => setFetching(false));
    }
  }, [fetching, selectedItem, useDebounced]);

  useEffect(() => {
    setIsLoaded(true);
    searchProject(useDebounced, selectedItem, 1)
      .then((data) => {
        setProjectsData(data.rows);
        console.log(data);
        setTotalCountSearch(data.countSearch);
        setCurrentPage(2);
        setIsLoaded(false);
      })
      .finally(() => setFetching(false));
  }, [selectedItem, useDebounced]);

  useEffect(() => {
    document.addEventListener("scroll", scrollHandler);

    return function () {
      document.removeEventListener("scroll", scrollHandler);
    };
  }, [projectsData, fetching, totalCountSearch]);

  const scrollHandler = (e) => {
    if (
      e.target.documentElement.scrollHeight -
        (e.target.documentElement.scrollTop + window.innerHeight) <
        200 &&
      projectsData.length < totalCountSearch
    ) {
      setFetching(true);
    }
  };

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
    { id: 11 },
  ];
  const lastAddedSkeletonList = [
    { id: 0 },
    { id: 1 },
    { id: 2 },
    { id: 3 },
    { id: 4 },
    { id: 5 },
    { id: 6 },
    { id: 7 },
  ];

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
    : sliderData.map((item) => {
        return (
          <SplideSlide key={item.id}>
            <Link to={PROJECTS_ROUTE + "/" + item.id}>
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
    projectsData.map((item) => {
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

  const projectError = !isLoaded && !projectsData.length && (
    <p className="projects__error">Не найдено</p>
  );

  return (
    <div className="container">
      <div className="projects">
        <h1 className="projects__title">Новые проекты</h1>
        <div
          className="projects__wrapper"
          style={{ position: "relative", display: "block" }}
          id="autoplay-example-heading"
        >
          <Splide
            hasTrack={false}
            options={{
              type: "loop",
              isNavigation: true,
              perPage: 4,
              cloneStatus: true,
              gap: 20,
              autoplay: true,
              resetProgress: false,
              pauseOnHover: true,
              interval: 3000,
              pagination: false,
              speed: 800,
              breakpoints: {
                1200: {
                  perPage: 3,
                },
                1024: {
                  perPage: 2,
                },
                768: {
                  arrows: false,
                },
                576: {
                  perPage: 1,
                },
              },
            }}
            aria-labelledby="autoplay-example-heading"
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
          {isLoadedSpinner && (
            <div className="projects__spinner">
              <Spinner />
            </div>
          )}
        </div>
      </div>
    </div>
  );
});

export default Projects;
