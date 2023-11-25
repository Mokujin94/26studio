import { makeAutoObservable } from "mobx";

export default class ProjectStore {
  constructor() {
    this._projects = [];
    this._projectName = "Без названия";
    this._projectDescr = "Без описания";
    this._projectPath = "";
    this._baseURL = "";
    this._projectPreview = "";

    makeAutoObservable(this);
  }

  setProjects(projects) {
    this._projects = projects;
  }

  setProjectName(projectName) {
    this._projectName = projectName;
  }

  setProjectDescr(projectDescr) {
    this._projectDescr = projectDescr;
  }

  setProjectPath(projectPath) {
    this._projectPath = projectPath;
  }

  setBaseURL(baseURL) {
    this._baseURL = baseURL;
  }

  setProjectPreview(projectPreview) {
    this._projectPreview = projectPreview;
  }

  get projects() {
    return this._projects;
  }

  get projectName() {
    return this._projectName;
  }

  get projectDescr() {
    return this._projectDescr;
  }

  get projectPath() {
    return this._projectPath;
  }

  get baseURL() {
    return this._baseURL;
  }

  get projectPreview() {
    return this._projectPreview;
  }
}
