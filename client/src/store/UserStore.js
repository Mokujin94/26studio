import {makeAutoObservable} from 'mobx'

export default class UserStore {
    constructor() {
        this._isAuth = true
        this._user = {}
        this._burgerMenu = [
            {id: 1, name: '26Studio', start_date: '30.01.2004', description: 'норм проект', img: 'https://vsegda-pomnim.com/uploads/posts/2022-03/1647070474_58-vsegda-pomnim-com-p-reka-saba-foto-65.jpg', is_private: false, amount_views: 0, amount_likes: 0, amount_comments: 0},
            {id: 2, name: '26Studio', start_date: '30.01.2004', description: 'норм проект', img: 'https://vsegda-pomnim.com/uploads/posts/2022-03/1647070474_58-vsegda-pomnim-com-p-reka-saba-foto-65.jpg', is_private: false, amount_views: 0, amount_likes: 0, amount_comments: 0},
            {id: 3, name: '26Studio', start_date: '30.01.2004', description: 'норм проект', img: 'https://vsegda-pomnim.com/uploads/posts/2022-03/1647070474_58-vsegda-pomnim-com-p-reka-saba-foto-65.jpg', is_private: false, amount_views: 0, amount_likes: 0, amount_comments: 0},
            {id: 4, name: '26Studio', start_date: '30.01.2004', description: 'норм проект', img: 'https://vsegda-pomnim.com/uploads/posts/2022-03/1647070474_58-vsegda-pomnim-com-p-reka-saba-foto-65.jpg', is_private: false, amount_views: 0, amount_likes: 0, amount_comments: 0},
        ]
        makeAutoObservable(this)
    }

    setAuth(bool) {
        this._isAuth = bool
    }
    setUser(user) {
        this._user = user
    }

    get isAuth() {
        return this._isAuth
    }
    get user() {
        return this._user
    }
}