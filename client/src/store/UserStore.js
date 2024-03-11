import { makeAutoObservable } from 'mobx';

import news from '../resource/graphics/icons/burgerMenu/newsIcon.svg';
import messeges from '../resource/graphics/icons/burgerMenu/messegesIcon.svg';
import control from '../resource/graphics/icons/burgerMenu/controlIcon.svg';
import project from '../resource/graphics/icons/burgerMenu/projectIcon.svg';
import group from '../resource/graphics/icons/burgerMenu/groupIcon.svg';
import about from '../resource/graphics/icons/burgerMenu/aboutIcon.svg';

import { ADMIN_ROUTE, GROUPS_ROUTE, MESSENGER_ROUTE, NEWS_ROUTE, PROJECTS_ROUTE } from '../utils/consts';

export default class UserStore {
  constructor() {
    this._isAuth = false;
    this._user = {};
    this._path = '';
    this._modalProject = false;
    this._modalNews = false;
    this._modalProfileMiniature = false;
    this._notifications = []
    this._errorAuth = [
      {
        id: 0,
        name: 'Никнейм',
        errors: [],
      },
      {
        id: 1,
        name: 'ФИО',
        errors: [],
      },
      {
        id: 2,
        name: 'Почта',
        errors: [],
      },
      {
        id: 3,
        name: 'Пароль',
        errors: [],
      },
      {
        id: 4,
        name: 'Повторный пароль',
        errors: [],
      },
    ];
    this._dataAuth = {
      name: '',
      fullName: '',
      email: '',
      password: '',
      passwordConfirm: '',
      group: 'Выберите группу',
      about: '',
      avatar: null,
    };
    this._codeAuth = 0;
    this._menuAuth = [
      { id: 0, title: 'Новости', icon: news, path: NEWS_ROUTE },
      { id: 1, title: 'Проекты', icon: project, path: PROJECTS_ROUTE },
      { id: 2, title: 'Мессенджер', icon: messeges, path: MESSENGER_ROUTE },
      { id: 3, title: 'Группы', icon: group, path: GROUPS_ROUTE },
      // { id: 3, title: 'Возможности', icon: about, path: GROUPS_ROUTE },
      { id: 4, title: 'Управление', icon: control, path: ADMIN_ROUTE },
    ];
    this._menu = [
      { id: 0, title: 'Новости', icon: news, path: NEWS_ROUTE },
      { id: 1, title: 'Проекты', icon: project, path: PROJECTS_ROUTE },
      { id: 2, title: 'Группы', icon: group, path: GROUPS_ROUTE },
      // { id: 3, title: 'Возможности', icon: about, path: GROUPS_ROUTE },
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

  setNotifications(notifications) {
    this._notifications = notifications;
  }

  setModalProfileMiniature(modalProfileMiniature) {
    this._modalProfileMiniature = modalProfileMiniature;
  }

  setModalProject(modalProject) {
    this._modalProject = modalProject;
  }

  setModalNews(modalNews) {
    this._modalNews = modalNews;
  }

  setErrorAuth(newErrors) {
    this._errorAuth = this._errorAuth.map((item, i) => {
      if (i === newErrors.id) {
        return newErrors;
      }
      return item;
    });
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

  get notifications() {
    return this._notifications;
  }

  get modalProfileMiniature() {
    return this._modalProfileMiniature;
  }

  get modalProject() {
    return this._modalProject;
  }

  get modalNews() {
    return this._modalNews;
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
