import {makeAutoObservable} from 'mobx'
import { createRef } from 'react'
import ProfileProjects from '../components/profilProjects/ProfileProjects'
import AchievementCard from '../components/achievementCard/AchievementCard'
import FriendCard from '../components/friendCard/FriendCard'

export default class ProfileStore {
    constructor() {

        this._wrapperItems = [
            {id: 0, element: <ProfileProjects/>, nodeRef: createRef(null)},
            {id: 1, element: <AchievementCard/>, nodeRef: createRef(null)},
            {id: 2, element: <FriendCard/>, nodeRef: createRef(null)},
            {id: 3, element: 'test', nodeRef: createRef(null)},
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