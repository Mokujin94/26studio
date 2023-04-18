const {Group} = require('../models/models')
const ApiError = require('../error/ApiError')

class GroupController {
    async create(req, res, next) {
        try {
            const {name} = req.body
            const group = await Group.create({name})
            return res.json(group)
        } catch (e) {
            next(ApiError.badRequest(e.message))
        }
    }

    async getAll(req, res) {
        // let {limit, page} = req.query
        // page = page || 1
        // limit = limit || 12
        // let offset = page * limit - limit    
                                          
        let groups = await Group.findAndCountAll()
        return res.json(groups) 
    }

    async getOne(req, res) {
        const {id} = req.params
        const group = await Group.findOne(
            {
                where: {id}
            }
        )
        return res.json(group)
    }
}

module.exports = new GroupController()