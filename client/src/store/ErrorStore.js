import { makeAutoObservable } from "mobx";

export default class ErrorStore {
  constructor() {
    this._notAuthError = false;
    makeAutoObservable(this);
  }

  setNotAuthError(bool) {
    this._notAuthError = bool;
  }

  get notAuthError() {
    return this._notAuthError;
  }
}
