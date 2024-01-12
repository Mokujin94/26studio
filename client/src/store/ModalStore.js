import { makeAutoObservable } from 'mobx';

export default class ModalStore {
  constructor() {
    this._modalComplete = false;
    this._modalCompleteMessage = '';
    makeAutoObservable(this);
  }

  setModalComplete(modalComplete) {
    this._modalComplete = modalComplete;
  }

  setModalCompleteMessage(modalCompleteMessage) {
    this._modalCompleteMessage = modalCompleteMessage;
  }

  get modalCompleteMessage() {
    return this._modalCompleteMessage;
  }

  get modalComplete() {
    return this._modalComplete;
  }
}
