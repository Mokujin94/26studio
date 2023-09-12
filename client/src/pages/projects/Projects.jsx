import React, { useEffect, useState } from 'react'
import ProjectCard from '../../components/projectCard/ProjectCard'
import projectPhoto from '../../resource/graphics/images/projectCard/bg.jpg'
import ProjectTags from '../../components/projectTags/ProjectTags'
import ProjectFilter from '../../components/projectFilter/ProjectFilter'
import Slider from "react-slick";

import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";
import './projects.scss'

import ProjectSkeleton from '../../components/ProjectSkeleton'
import SliderButton from '../../components/sliderButton/SliderButton'
import { Link } from 'react-router-dom'
import { PROJECTS_ROUTE, PROJECT_ROUTE } from '../../utils/consts'

function Projects() {

  const stylePrevArrow = {transform: "rotate(180deg)"}

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
    prevArrow: <SliderButton styling={stylePrevArrow} />
  };

  const skeletonList = [
    {id: 0},
    {id: 1},
    {id: 2},
    {id: 3},
    {id: 4},
    {id: 5},
    {id: 6},
    {id: 7},
    {id: 8},
    {id: 9},
    {id: 10},
  ]
  const lastAddedSkeletonList = [
    {id: 0},
    {id: 1},
    {id: 2},
    {id: 3},
  ]
  const lastAddedProjects = [
          {id: 0, element: <ProjectCard img={projectPhoto} title={'Arkana'} name={'mokujin94'} date={'03.04.23'} like={22} view={232} comment={12}/>},
          {id: 1, element: <ProjectCard img={projectPhoto} title={'Arkana'} name={'mokujin94'} date={'03.04.23'} like={22} view={232} comment={12}/>},
          {id: 2, element: <ProjectCard img={projectPhoto} title={'Arkana'} name={'mokujin94'} date={'03.04.23'} like={22} view={232} comment={12}/>},
          {id: 3, element: <ProjectCard img={projectPhoto} title={'Arkana'} name={'mokujin94'} date={'03.04.23'} like={22} view={232} comment={12}/>},
          {id: 4, element: <ProjectCard img={projectPhoto} title={'Arkana'} name={'mokujin94'} date={'03.04.23'} like={22} view={232} comment={12}/>},
          {id: 5, element: <ProjectCard img={projectPhoto} title={'Arkana'} name={'mokujin94'} date={'03.04.23'} like={22} view={232} comment={12}/>},
          {id: 6, element: <ProjectCard img={projectPhoto} title={'Arkana'} name={'mokujin94'} date={'03.04.23'} like={22} view={232} comment={12}/>}
  ]

  const projectsList = [
    {id: 0, element: <ProjectCard img={projectPhoto} title={'Arkana'} name={'mokujin94'} date={'03.04.23'} like={22} view={232} comment={12}/>},
    {id: 1, element: <ProjectCard img={projectPhoto} title={'Arkana'} name={'mokujin94'} date={'03.04.23'} like={22} view={232} comment={12}/>},
    {id: 2, element: <ProjectCard img={projectPhoto} title={'Arkana'} name={'mokujin94'} date={'03.04.23'} like={22} view={232} comment={12}/>},
    {id: 3, element: <ProjectCard img={projectPhoto} title={'Arkana'} name={'mokujin94'} date={'03.04.23'} like={22} view={232} comment={12}/>},
    {id: 4, element: <ProjectCard img={projectPhoto} title={'Arkana'} name={'mokujin94'} date={'03.04.23'} like={22} view={232} comment={12}/>},
    {id: 5, element: <ProjectCard img={projectPhoto} title={'Arkana'} name={'mokujin94'} date={'03.04.23'} like={22} view={232} comment={12}/>},
    {id: 6, element: <ProjectCard img={projectPhoto} title={'Arkana'} name={'mokujin94'} date={'03.04.23'} like={22} view={232} comment={12}/>},
    {id: 7, element: <ProjectCard img={projectPhoto} title={'Arkana'} name={'mokujin94'} date={'03.04.23'} like={22} view={232} comment={12}/>},
    {id: 8, element: <ProjectCard img={projectPhoto} title={'Arkana'} name={'mokujin94'} date={'03.04.23'} like={22} view={232} comment={12}/>},
    {id: 9, element: <ProjectCard img={projectPhoto} title={'Arkana'} name={'mokujin94'} date={'03.04.23'} like={22} view={232} comment={12}/>},
    {id: 10, element: <ProjectCard img={projectPhoto} title={'Arkana'} name={'mokujin94'} date={'03.04.23'} like={22} view={232} comment={12}/>},
    {id: 11, element: <ProjectCard img={projectPhoto} title={'Arkana'} name={'mokujin94'} date={'03.04.23'} like={22} view={232} comment={12}/>},
    {id: 12, element: <ProjectCard img={projectPhoto} title={'Arkana'} name={'mokujin94'} date={'03.04.23'} like={22} view={232} comment={12}/>},
    {id: 13, element: <ProjectCard img={projectPhoto} title={'Arkana'} name={'mokujin94'} date={'03.04.23'} like={22} view={232} comment={12}/>},
    {id: 14, element: <ProjectCard img={projectPhoto} title={'Arkana'} name={'mokujin94'} date={'03.04.23'} like={22} view={232} comment={12}/>},
    {id: 15, element: <ProjectCard img={projectPhoto} title={'Arkana'} name={'mokujin94'} date={'03.04.23'} like={22} view={232} comment={12}/>},
    {id: 16, element: <ProjectCard img={projectPhoto} title={'Arkana'} name={'mokujin94'} date={'03.04.23'} like={22} view={232} comment={12}/>},
    {id: 17, element: <ProjectCard img={projectPhoto} title={'Arkana'} name={'mokujin94'} date={'03.04.23'} like={22} view={232} comment={12}/>},
    {id: 18, element: <ProjectCard img={projectPhoto} title={'Arkana'} name={'mokujin94'} date={'03.04.23'} like={22} view={232} comment={12}/>},
]

  const newSkeletonList = skeletonList.map(({id}) => (
    <ProjectSkeleton key={id}/>
  ))
  const newLastAddedSkeletonList = lastAddedSkeletonList.map(({id}) => (
    <ProjectSkeleton key={id}/>
  ))
  const [isLoaded, setIsLoaded] = useState(true)
  const [projectCollection, setProjectCollection] = useState([])
  const [lastAddedProjectCollection, setLastAddedProjectCollection] = useState([])
  useEffect(() => {
    setTimeout(() => {
      setProjectCollection(projectsList.map(({id, element}) => {
        return (
          <Link to={PROJECTS_ROUTE + '/' + (id + 1)}>
            <ProjectCard key={id} img={projectPhoto} title={'Arkana'} name={'mokujin94'} date={'03.04.23'} like={22} view={232} comment={12}/>
          </Link>
        )
      }));
      setLastAddedProjectCollection(lastAddedProjects.map(({id, element}) => {
        return(
          <ProjectCard key={id} img={projectPhoto} title={'Arkana'} name={'mokujin94'} date={'03.04.23'} like={22} view={232} comment={12}/>
        )
      }));
      setIsLoaded(false);
    }, 100)
  }, [])
  
  return (
    <div className="container">
      <div className="projects">
        <h1 className="projects__title">Последние добавленные проекты:</h1>
        <div className="projects__wrapper" style={{display: 'block'}}>
          <Slider {...settings}>
            {isLoaded ? newLastAddedSkeletonList : lastAddedProjectCollection}
            {/* {newLastAddedSkeletonList} */}
          </Slider>
        </div>
        <ProjectTags/>
        <div className="projects__wrapper">
          <ProjectFilter/>
          {isLoaded ? newSkeletonList : projectCollection}


        </div>
      </div>
    
    </div>
  )
}

export default Projects
//<ProjectCard img={projectPhoto} title={'Arkana'} name={'mokujin94'} date={'03.04.23'} like={22} view={232} comment={12}/>
