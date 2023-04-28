import React from 'react'

import style from './profileProjects.module.scss'

import projectPhoto from '../../resource/graphics/images/projectCard/bg.jpg'

import ProjectCard from '../projectCard/ProjectCard'
import FriendCard from '../friendCard/FriendCard'

function ProfileProjects() {
  return (
    <>
        {/* <FriendCard/>
        <FriendCard/>
        <FriendCard/>
        <FriendCard/>
        <FriendCard/>
        <FriendCard/>
        <FriendCard/>
        <FriendCard/>
        <FriendCard/>
        <FriendCard/>
        <FriendCard/>
        <FriendCard/>
        <FriendCard/>
        <FriendCard/>
        <FriendCard/>
        <FriendCard/>
        <FriendCard/>
        <FriendCard/>
        <FriendCard/>
        <FriendCard/>
        <FriendCard/>
        <FriendCard/>
        <FriendCard/>
        <FriendCard/> */}
        <ProjectCard img={projectPhoto} title={'Arkana'} name={'mokujin94'} date={'03.04.23'} like={22} view={232} comment={12}/>
        <ProjectCard img={projectPhoto} title={'Arkana'} name={'mokujin94'} date={'03.04.23'} like={22} view={232} comment={12}/>
        <ProjectCard img={projectPhoto} title={'Arkana'} name={'mokujin94'} date={'03.04.23'} like={22} view={232} comment={12}/>
        <ProjectCard img={projectPhoto} title={'Arkana'} name={'mokujin94'} date={'03.04.23'} like={22} view={232} comment={12}/>
        <ProjectCard img={projectPhoto} title={'Arkana'} name={'mokujin94'} date={'03.04.23'} like={22} view={232} comment={12}/>
        <ProjectCard img={projectPhoto} title={'Arkana'} name={'mokujin94'} date={'03.04.23'} like={22} view={232} comment={12}/>
        <ProjectCard img={projectPhoto} title={'Arkana'} name={'mokujin94'} date={'03.04.23'} like={22} view={232} comment={12}/>
        <ProjectCard img={projectPhoto} title={'Arkana'} name={'mokujin94'} date={'03.04.23'} like={22} view={232} comment={12}/>
        <ProjectCard img={projectPhoto} title={'Arkana'} name={'mokujin94'} date={'03.04.23'} like={22} view={232} comment={12}/>
        <ProjectCard img={projectPhoto} title={'Arkana'} name={'mokujin94'} date={'03.04.23'} like={22} view={232} comment={12}/>
        <ProjectCard img={projectPhoto} title={'Arkana'} name={'mokujin94'} date={'03.04.23'} like={22} view={232} comment={12}/>
        <ProjectCard img={projectPhoto} title={'Arkana'} name={'mokujin94'} date={'03.04.23'} like={22} view={232} comment={12}/>
    </>
  )
}

export default ProfileProjects