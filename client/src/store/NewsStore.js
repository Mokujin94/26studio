import {makeAutoObservable} from 'mobx'

export default class NewsStore {
    constructor() {
        this._news = [
            {id: 1, title: '26Studio2', description: 'Давно выяснено, ', img: 'https://vsegda-pomnim.com/uploads/posts/2022-03/1647070474_58-vsegda-pomnim-com-p-reka-saba-foto-65.jpg', amount_views: 0, amount_likes: 0, amount_comments: 0},
            {id: 2, title: '26Studio', description: 'Давно выяснено, что при оценке дизайна и композиции читаемый текст мешает сосредоточиться. Lorem Ipsum используют потому, что тот обеспечивает более или менее стандартное заполнение шаблона, а также реальное распределение букв и пробелов в абзацах, которое не получается при простой дубликации "Здесь ваш текст.. простой дубликации "Здесь ваш текст.. простой дубликации "Здесь ваш текст', img: 'https://vsegda-pomnim.com/uploads/posts/2022-03/1647070474_58-vsegda-pomnim-com-p-reka-saba-foto-65.jpg', amount_views: 0, amount_likes: 100, amount_comments: 0},
            {id: 3, title: '26Studio', description: 'Давно выяснено, что при оценке дизайна и композиции читаемый текст мешает сосредоточиться. Lorem Ipsum используют потому, что тот обеспечивает более или менее стандартное заполнение шаблона, а также реальное распределение букв и пробелов в абзацах, которое не получается при простой дубликации "Здесь ваш текст..', img: 'https://vsegda-pomnim.com/uploads/posts/2022-03/1647070474_58-vsegda-pomnim-com-p-reka-saba-foto-65.jpg', amount_views: 0, amount_likes: 0, amount_comments: 0},
            {id: 4, title: '26Studio', description: 'Давно выяснено, что при оценке дизайна и композиции читаемый текст мешает сосредоточиться. Lorem Ipsum используют потому, что тот обеспечивает более или менее стандартное заполнение шаблона, а также реальное распределение букв и пробелов в абзацах, которое не получается при простой дубликации "Здесь ваш текст..', img: 'https://vsegda-pomnim.com/uploads/posts/2022-03/1647070474_58-vsegda-pomnim-com-p-reka-saba-foto-65.jpg', amount_views: 0, amount_likes: 0, amount_comments: 0},
            {id: 5, title: '26Studio', description: 'Давно выяснено, что при оценке дизайна и композиции читаемый текст мешает сосредоточиться. Lorem Ipsum используют потому, что тот обеспечивает более или менее стандартное заполнение шаблона, а также реальное распределение букв и пробелов в абзацах, которое не получается при простой дубликации "Здесь ваш текст..', img: 'https://vsegda-pomnim.com/uploads/posts/2022-03/1647070474_58-vsegda-pomnim-com-p-reka-saba-foto-65.jpg', amount_views: 0, amount_likes: 0, amount_comments: 0},
            {id: 6, title: '26Studio', description: 'Давно выяснено, что при оценке дизайна и композиции читаемый текст мешает сосредоточиться. Lorem Ipsum используют потому, что тот обеспечивает более или менее стандартное заполнение шаблона, а также реальное распределение букв и пробелов в абзацах, которое не получается при простой дубликации "Здесь ваш текст..', img: 'https://vsegda-pomnim.com/uploads/posts/2022-03/1647070474_58-vsegda-pomnim-com-p-reka-saba-foto-65.jpg', amount_views: 0, amount_likes: 0, amount_comments: 0},
            {id: 7, title: '26Studio', description: 'Давно выяснено, что при оценке дизайна и композиции читаемый текст мешает сосредоточиться. Lorem Ipsum используют потому, что тот обеспечивает более или менее стандартное заполнение шаблона, а также реальное распределение букв и пробелов в абзацах, которое не получается при простой дубликации "Здесь ваш текст..', img: 'https://vsegda-pomnim.com/uploads/posts/2022-03/1647070474_58-vsegda-pomnim-com-p-reka-saba-foto-65.jpg', amount_views: 0, amount_likes: 0, amount_comments: 0},
            {id: 8, title: '26Studio', description: 'Давно выяснено, что при оценке дизайна и композиции читаемый текст мешает сосредоточиться. Lorem Ipsum используют потому, что тот обеспечивает более или менее стандартное заполнение шаблона, а также реальное распределение букв и пробелов в абзацах, которое не получается при простой дубликации "Здесь ваш текст..', img: 'https://vsegda-pomnim.com/uploads/posts/2022-03/1647070474_58-vsegda-pomnim-com-p-reka-saba-foto-65.jpg', amount_views: 0, amount_likes: 0, amount_comments: 0},
            {id: 9, title: '26Studio', description: 'Давно выяснено, что при оценке дизайна и композиции читаемый текст мешает сосредоточиться. Lorem Ipsum используют потому, что тот обеспечивает более или менее стандартное заполнение шаблона, а также реальное распределение букв и пробелов в абзацах, которое не получается при простой дубликации "Здесь ваш текст..', img: 'https://vsegda-pomnim.com/uploads/posts/2022-03/1647070474_58-vsegda-pomnim-com-p-reka-saba-foto-65.jpg', amount_views: 0, amount_likes: 0, amount_comments: 0},
            {id: 10, title: '26Studio', description: 'Давно выяснено, что при оценке дизайна и композиции читаемый текст мешает сосредоточиться. Lorem Ipsum используют потому, что тот обеспечивает более или менее стандартное заполнение шаблона, а также реальное распределение букв и пробелов в абзацах, которое не получается при простой дубликации "Здесь ваш текст..', img: 'https://vsegda-pomnim.com/uploads/posts/2022-03/1647070474_58-vsegda-pomnim-com-p-reka-saba-foto-65.jpg', amount_views: 0, amount_likes: 0, amount_comments: 0},
           
        ]
        makeAutoObservable(this)
    }

    setNews(news) {
        this._news = news
    }


    get news() {
        return this._news
    }

}