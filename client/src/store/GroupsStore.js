import {makeAutoObservable} from 'mobx'

export default class GroupStore {
    constructor() {
        this._groups = [
            {id: 1, name: 'ИС 31/9', id_curator: 1},
            {id: 2, name: 'ИС 32/9', id_curator: 2},
            {id: 3, name: 'ИС 33/9', id_curator: 3}
        ]
        makeAutoObservable(this)
    }

    setGrops(groups) {
        this._groups = groups
    }


    get groups() {
        return this._groups
    }

}