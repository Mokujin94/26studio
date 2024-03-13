import { makeAutoObservable } from "mobx";

export default class ProjectStore {
	constructor() {
		this._projects = [];
		this._projectName = "";
		this._projectDescr = "";
		this._projectPath = "";
		this._projectSelectedPath = "0";
		this._baseURL = "";
		this._projectPreview = "";
		this._projectPrivate = false;
		this._projectPrivateComments = false;

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

	setProjectSelectedPath(projectSelectedPath) {
		this._projectSelectedPath = projectSelectedPath;
	}

	setBaseURL(baseURL) {
		this._baseURL = baseURL;
	}

	setProjectPreview(projectPreview) {
		this._projectPreview = projectPreview;
	}

	setProjectPrivate(projectPrivate) {
		this._projectPrivate = projectPrivate;
	}

	setProjectPrivateComments(projectPrivateComments) {
		this._projectPrivateComments = projectPrivateComments;
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

	get projectSelectedPath() {
		return this._projectSelectedPath;
	}

	get baseURL() {
		return this._baseURL;
	}

	get projectPreview() {
		return this._projectPreview;
	}

	get projectPrivate() {
		return this._projectPrivate;
	}

	get projectPrivateComments() {
		return this._projectPrivateComments;
	}
}
