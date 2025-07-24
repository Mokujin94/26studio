const {Message} = require('../models/models')
const uuid = require('uuid')
const path = require('path')
const ApiError = require('../error/ApiError')

class MessageController {
    async create(req, res, next) {
        try {
            const {userId, chatId} = req.body
            let fileName = null
            if (req.files && req.files.img) {
                const {img} = req.files
                fileName = uuid.v4() + path.extname(img.name)
                img.mv(path.resolve(__dirname, '..', 'static/messages', fileName))
            }
            const message = await Message.create({userId, chatId, files: fileName})
            return res.json(message)
        } catch (e) {
            next(ApiError.badRequest(e.message))
        }
    }
}

module.exports = new MessageController()
