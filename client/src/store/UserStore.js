import {makeAutoObservable} from 'mobx'

import news from "../resource/graphics/icons/burgerMenu/newsIcon.svg";
import messeges from "../resource/graphics/icons/burgerMenu/messegesIcon.svg";
import project from "../resource/graphics/icons/burgerMenu/projectIcon.svg";
import group from "../resource/graphics/icons/burgerMenu/groupIcon.svg";
import { GROUPS_ROUTE, MESSENGER_ROUTE, NEWS_ROUTE, PROJECTS_ROUTE } from '../utils/consts';

export default class UserStore {
    constructor() {
        this._isAuth = true
        this._user = {}
        this._menu = [
            {id: 0, title: 'Новости', icon: news, path: NEWS_ROUTE},
            {id: 1, title: 'Мессенджер', icon: messeges, path: MESSENGER_ROUTE},
            {id: 2, title: 'Проекты', icon: project, path: PROJECTS_ROUTE},
            {id: 3, title: 'Группы', icon: group, path: GROUPS_ROUTE},
        ]
        makeAutoObservable(this)
    }

    setAuth(bool) {
        this._isAuth = bool
    }
    setUser(user) {
        this._user = user
    }

    setMenu(menu) {
        this._menu = menu
    }

    get isAuth() {
        return this._isAuth
    }
    get user() {
        return this._user
    }

    get menu() {
        return this._menu
    }
}