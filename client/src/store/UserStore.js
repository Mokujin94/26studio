import { makeAutoObservable } from "mobx";

import news from "../resource/graphics/icons/burgerMenu/newsIcon.svg";
import messeges from "../resource/graphics/icons/burgerMenu/messegesIcon.svg";
import project from "../resource/graphics/icons/burgerMenu/projectIcon.svg";
import group from "../resource/graphics/icons/burgerMenu/groupIcon.svg";
import {
  GROUPS_ROUTE,
  MESSENGER_ROUTE,
  NEWS_ROUTE,
  PROJECTS_ROUTE,
} from "../utils/consts";

export default class UserStore {
  constructor() {
    this._isAuth = false;
    this._user = {};
    this._path = "";
    this._errorAuth = [];
    this._dataAuth = {
      name: "",
      fullName: "",
      email: "",
      password: "",
      passwordConfirm: "",
      group: "Выберите группу",
      about: "",
    };
    this._codeAuth = 0;
    this._menuAuth = [
      { id: 0, title: "Новости", icon: news, path: NEWS_ROUTE },
      { id: 1, title: "Проекты", icon: project, path: PROJECTS_ROUTE },
      { id: 2, title: "Группы", icon: group, path: GROUPS_ROUTE },
      { id: 3, title: "О нас", icon: messeges, path: GROUPS_ROUTE },
    ];
    this._menu = [
      { id: 0, title: "Новости", icon: news, path: NEWS_ROUTE },
      { id: 1, title: "Проекты", icon: project, path: PROJECTS_ROUTE },
      { id: 2, title: "Группы", icon: group, path: GROUPS_ROUTE },
      { id: 3, title: "О нас", icon: messeges, path: GROUPS_ROUTE },
    ];
    this._burgerActive = false;
    makeAutoObservable(this);
  }

  setAuth(bool) {
    this._isAuth = bool;
  }
  setUser(user) {
    this._user = user;
  }

  setDataAuth(dataAuth) {
    this._dataAuth = dataAuth;
  }

  setCodeAuth(code) {
    this._codeAuth = code;
  }

  setMenuAuth(menuAuth) {
    this._menuAuth = menuAuth;
  }

  setMenu(menu) {
    this._menu = menu;
  }

  setPath(path) {
    this._path = path;
  }

  setErrorAuth(errorAuth) {
    this._errorAuth = [...this._errorAuth, {name: errorAuth}];
  }

  setBurgerActive(bool) {
    this._burgerActive = bool;
  }

  get isAuth() {
    return this._isAuth;
  }
  get user() {
    return this._user;
  }

  get menuAuth() {
    return this._menuAuth;
  }

  get menu() {
    return this._menu;
  }

  get path() {
    return this._path;
  }

  get errorAuth() {
    return this._errorAuth;
  }

  get dataAuth() {
    return this._dataAuth;
  }

  get codeAuth() {
    return this._codeAuth;
  }

  get burgerActive() {
    return this._burgerActive;
  }
}
