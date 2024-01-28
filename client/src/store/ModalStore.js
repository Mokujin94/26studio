import { makeAutoObservable } from "mobx";

export default class ModalStore {
  constructor() {
    this._modalComplete = false;
    this._modalError = false;
    this._modalCompleteMessage = "";
    this._modalErrorMessage = "";
    makeAutoObservable(this);
  }

  setModalComplete(modalComplete) {
    this._modalComplete = modalComplete;
  }

  setModalError(modalError) {
    this._modalError = modalError;
  }

  setModalCompleteMessage(modalCompleteMessage) {
    this._modalCompleteMessage = modalCompleteMessage;
  }

  setModalErrorMessage(modalErrorMessage) {
    this._modalErrorMessage = modalErrorMessage;
  }

  get modalCompleteMessage() {
    return this._modalCompleteMessage;
  }

  get modalErrorMessage() {
    return this._modalErrorMessage;
  }

  get modalComplete() {
    return this._modalComplete;
  }

  get modalError() {
    return this._modalError;
  }
}
