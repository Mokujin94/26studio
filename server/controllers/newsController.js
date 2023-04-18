const {News} = require('../models/models')
const uuid = require('uuid')
const path = require('path')
const ApiError = require('../error/ApiError')

class NewsController {
    async create(req, res, next) {
        try {
            const {title, description} = req.body
            const {img} = req.files
            let fileName = uuid.v4() + ".jpg"
            img.mv(path.resolve(__dirname, '..', 'static/news', fileName))
            const news = await News.create({title, description, img: fileName})
            return res.json(news)
        } catch (e) {
            next(ApiError.badRequest(e.message))
        }
    }

    async getAll(req, res) {
        let {limit, page} = req.query
        page = page || 1
        limit = limit || 12
        let offset = page * limit - limit
                                          
        let news = await News.findAndCountAll({limit, offset})
        return res.json(news) 
    }

    async getOne(req, res) {
        const {id} = req.params
        const news = await News.findOne(
            {
                where: {id}
            }
        )
        return res.json(news)
    }
    
}

module.exports = new NewsController()