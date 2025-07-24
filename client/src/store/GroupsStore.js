import { makeAutoObservable } from 'mobx';

export default class GroupStore {
  constructor() {
    this._groups = [];
    makeAutoObservable(this);
  }

  setGroups(groups) {
    this._groups = groups;
  }

  get groups() {
    return this._groups;
  }
}
