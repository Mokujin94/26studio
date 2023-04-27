import {makeAutoObservable} from 'mobx'
import { createRef } from 'react'
import ProfileProjects from '../components/profilProjects/ProfileProjects'
import AchievementCard from '../components/achievementCard/AchievementCard'
import FriendCard from '../components/friendCard/FriendCard'
import SettingCard from '../components/settingCard/SettingCard'
import projectPhoto from '../resource/graphics/images/projectCard/bg.jpg'

import ProfileSettings from '../components/profileSettings/ProfileSettings'
import ProjectCard from '../components/projectCard/ProjectCard'
import ProgressAchievement from '../components/progressAchievement/ProgressAchievement'
import ProfileAchievements from '../components/profileAchievements/ProfileAchievements'

export default class ProfileStore {
    constructor() {

        this._wrapperItems = [
            {id: 0, element: <ProjectCard img={projectPhoto} title={'Arkana'} name={'mokujin94'} date={'03.04.23'} like={22} view={232} comment={12}/>, nodeRef: createRef(null)},
            {id: 1, element: <ProfileProjects/>, nodeRef: createRef(null)},
            {id: 2, element: <ProfileAchievements/>, nodeRef: createRef(null)},
            {id: 3, element: <ProfileSettings/>, nodeRef: createRef(null)},
        ]

        this._menuItems = [
            {id: 0, title: 'Проекты'},
            {id: 1, title: 'Друзья'},
            {id: 2, title: 'Награды'},
            {id: 3, title: 'Настройки'},
        ]

        this._selectedMenu = {id: 0, title: 'Проекты'}
        makeAutoObservable(this)
    }

    setWrapperItems(wrapperItems) {
        this._wrapperItems = wrapperItems
    }

    setMenuItems(menuItems) {
        this._menuItems = menuItems
    }

    setSelectedMenu(menuItems) {
        this._selectedMenu = menuItems
    }

    get wrapperItems() {
        return this._wrapperItems
    }

    get menuItems() {
        return this._menuItems
    }

    get selectedMenu() {
        return this._selectedMenu
    }
}